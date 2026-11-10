"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useLocale, useTranslations } from "@/i18n/client";
import { API_HOST } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";

function asRecord(value: unknown): Record<string, unknown> | null {
	return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

function getTenants(profile: unknown): unknown[] {
	const root = asRecord(profile);
	const data = asRecord(root?.data);
	const user = asRecord(root?.user);
	const candidates = [root?.tenants, data?.tenants, user?.tenants];
	return candidates.find(Array.isArray) as unknown[] | undefined ?? [];
}

function getWorkspaceLabel(tenant: unknown, index: number, t: (key: string) => string): string {
	const record = asRecord(tenant);
	const nestedTenant = asRecord(record?.tenant);
	const label = nestedTenant?.name;
	return typeof label === "string" && label.trim()
		? label
		: t("workspace.number").replace("{number}", String(index + 1));
}

function getWorkspaceValue(tenant: unknown): string {
	const record = asRecord(tenant);
	const nestedTenant = asRecord(record?.tenant);
	const id = nestedTenant?.id;
	return typeof id === "string" || typeof id === "number" ? String(id) : "";
}

// The backend answers 401 when the login token is invalid or expired
function isSessionExpired(error: unknown): boolean {
	return axios.isAxiosError(error) && error.response?.status === 401;
}

// Forget the stored login so the user starts clean on the sign-in page
function clearSession() {
	for (const key of ["jwt", "profile", "selectedTenant", "tenantId"]) {
		window.localStorage.removeItem(key);
	}
}

export default function WorkspaceSelectionPage() {
	const t = useTranslations();
	const router = useRouter();
	const [tenants, setTenants] = useState<unknown[]>([]);
	const [selectedTenantId, setSelectedTenantId] = useState("");
	const [loading, setLoading] = useState(true);
	const locale = useLocale();
	const [workspaceName, setWorkspaceName] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");
	const [showCreateForm, setShowCreateForm] = useState(false);

	useEffect(() => {
		// Set when the user leaves the page, so a late response doesn't update a gone page
		let cancelled = false;

		const timeoutId = window.setTimeout(async () => {
			const jwt = window.localStorage.getItem("jwt");
			if (!jwt) {
				router.replace(`/${locale}/auth/signin`);
				return;
			}

			// 1. Show the list saved at login straight away
			let cachedTenants: unknown[] = [];
			try {
				const profileText = window.localStorage.getItem("profile");
				cachedTenants = getTenants(profileText ? JSON.parse(profileText) : null);
			} catch {
				cachedTenants = [];
			}
			setTenants(cachedTenants);
			// If the saved list is empty, keep "Loading..." until the fresh list arrives,
			// so we don't flash the "create your first workspace" form by mistake
			if (cachedTenants.length > 0) {
				setLoading(false);
			}

			// 2. Fetch the latest profile so workspaces created elsewhere show up
			try {
				const profileResponse = await axios.get<unknown>(`${API_HOST}/api/auth/me`, {
					headers: { Authorization: `Bearer ${jwt}` },
				});
				if (cancelled) return;
				window.localStorage.setItem("profile", JSON.stringify(profileResponse.data));
				setTenants(getTenants(profileResponse.data));
			} catch (error) {
				if (cancelled) return;
				if (isSessionExpired(error)) {
					clearSession();
					router.replace(`/${locale}/auth/signin`);
					return;
				}
				// Any other failure (e.g. offline): keep showing the saved list
				console.error("Failed to refresh workspaces:", error);
			} finally {
				if (!cancelled) setLoading(false);
			}
		}, 0);

		return () => {
			cancelled = true;
			window.clearTimeout(timeoutId);
		};
	}, [locale, router]);

	const workspaces = tenants.map((tenant, index) => ({
		label: getWorkspaceLabel(tenant, index, t),
		value: getWorkspaceValue(tenant),
		tenant,
	}));

	function continueToTools() {
		const selected = workspaces.find((workspace) => workspace.value === selectedTenantId);
		if (!selected) {
			return;
		}

		window.localStorage.setItem("selectedTenant", JSON.stringify(selected.tenant));
		window.localStorage.setItem("tenantId", selected.value);

		router.push("/tools");
	}

	async function createWorkspace(event: FormEvent<HTMLFormElement>) {
		// Stop the browser from reloading the page on form submit
		event.preventDefault();

		const name = workspaceName.trim();
		if (!name) {
			return;
		}

		// The login token saved by the sign-up / sign-in page
		const jwt = window.localStorage.getItem("jwt");
		if (!jwt) {
			router.push(`/${locale}/auth/signin`);
			return;
		}

		setCreating(true);
		setCreateError("");

		try {
			const headers = { Authorization: `Bearer ${jwt}` };

			// 1. Create the workspace
			const createResponse = await axios.post<unknown>(
				`${API_HOST}/api/tenant`,
				{ data: { name } },
				{ headers },
			);
			const created = asRecord(createResponse.data);
			const createdId = created?.id ?? created?._id;

			// 2. Fetch the profile again so it now includes the new workspace
			const profileResponse = await axios.get<unknown>(`${API_HOST}/api/auth/me`, { headers });
			window.localStorage.setItem("profile", JSON.stringify(profileResponse.data));

			// 3. Find the new workspace in the profile (by id, else the one that wasn't there before)
			const updatedTenants = getTenants(profileResponse.data);
			// Ids of the workspaces the user had before creating this one
			const previousIds = new Set(workspaces.map((workspace) => workspace.value));
			const newTenant =
				updatedTenants.find((item) => getWorkspaceValue(item) === String(createdId)) ??
				updatedTenants.find((item) => !previousIds.has(getWorkspaceValue(item)));

			if (!newTenant) {
				throw new Error("Workspace was created but is missing from the profile");
			}

			// 4. Select it exactly the way continueToTools() does, then go to the tools
			window.localStorage.setItem("selectedTenant", JSON.stringify(newTenant));
			window.localStorage.setItem("tenantId", getWorkspaceValue(newTenant));
			router.push("/tools");
		} catch (error) {
			if (isSessionExpired(error)) {
				clearSession();
				router.replace(`/${locale}/auth/signin`);
				return;
			}
			console.error("Failed to create workspace:", error);
			setCreateError(t("workspace.createError"));
		} finally {
			setCreating(false);
		}
	}

	const hasNoWorkspaces = !loading && workspaces.length === 0;
	// Show the form if there's nothing to pick, or the user asked to create one
	const isCreateMode = hasNoWorkspaces || (!loading && showCreateForm);

	function openCreateForm() {
		setWorkspaceName("");
		setCreateError("");
		setShowCreateForm(true);
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f3f5f0] px-5 py-10">
			<section className="w-full max-w-lg border border-black/10 bg-white px-6 py-8 shadow-[0_18px_60px_rgba(35,49,39,0.08)] sm:px-10 sm:py-10">
				<div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
					<Building2 aria-hidden="true" className="h-5 w-5" />
				</div>

				{isCreateMode ? (
					<>
						<h1 className="mt-7 text-3xl font-semibold text-[#202820]">
							{hasNoWorkspaces ? t("workspace.createTitle") : t("workspace.newTitle")}
						</h1>
						<p className="mt-3 text-sm text-muted-foreground">
							{hasNoWorkspaces ? t("workspace.createDescription") : t("workspace.newDescription")}
						</p>

						<form className="mt-8 space-y-2" onSubmit={createWorkspace}>
							<label htmlFor="workspace-name" className="text-sm font-medium">{t("workspace.nameLabel")}</label>
							<Input
								id="workspace-name"
								name="workspaceName"
								required
								maxLength={100}
								autoFocus
								placeholder={t("workspace.namePlaceholder")}
								value={workspaceName}
								onChange={(event) => setWorkspaceName(event.target.value)}
								disabled={creating}
							/>

							{createError && <p className="pt-1 text-sm text-destructive" role="alert">{createError}</p>}

							<Button
								type="submit"
								className="mt-6 w-full"
								disabled={creating || workspaceName.trim() === ""}
							>
								{creating ? t("workspace.creating") : t("workspace.create")}
							</Button>

							{!hasNoWorkspaces && (
								<button
									type="button"
									onClick={() => setShowCreateForm(false)}
									disabled={creating}
									className="mt-4 w-full text-center text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
								>
									{t("workspace.cancel")}
								</button>
							)}
						</form>
					</>
				) : (
					<>
						<h1 className="mt-7 text-3xl font-semibold text-[#202820]">{t("workspace.title")}</h1>
						<p className="mt-3 text-sm text-muted-foreground">{t("workspace.description")}</p>

						<div className="mt-8 space-y-2">
							<label htmlFor="workspace-select" className="text-sm font-medium">{t("workspace.label")}</label>
							{loading ? (
								<p className="py-3 text-sm text-muted-foreground" role="status">{t("workspace.loading")}</p>
							) : (
								<select
									id="workspace-select"
									value={selectedTenantId}
									onChange={(event) => setSelectedTenantId(event.target.value)}
									className="h-11 w-full border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
								>
									<option value="">{t("workspace.placeholder")}</option>
									{workspaces.map((workspace, index) => (
										<option key={`${workspace.value}-${index}`} value={workspace.value}>
											{workspace.label}
										</option>
									))}
								</select>
							)}
						</div>

						<Button
							type="button"
							className="mt-6 w-full"
							disabled={loading || selectedTenantId === ""}
							onClick={continueToTools}
						>
							{t("workspace.continue")}
						</Button>

						{!loading && (
							<button
								type="button"
								onClick={openCreateForm}
								className="mt-4 w-full text-center text-sm font-medium text-primary underline-offset-4 hover:underline"
							>
								{t("workspace.createAnother")}
							</button>
						)}
					</>
				)}
			</section>
		</main>
	);
}
