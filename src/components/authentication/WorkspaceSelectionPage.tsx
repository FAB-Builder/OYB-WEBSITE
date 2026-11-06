"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useTranslations } from "@/i18n/client";
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

function getRequestError(error: unknown, fallback: string): string {
	if (axios.isAxiosError(error)) {
		const payload = error.response?.data;
		if (typeof payload === "string" && payload.length > 0) {
			return payload;
		}
		const record = asRecord(payload);
		const message = record?.message ?? asRecord(record?.error)?.message ?? record?.error;
		if (typeof message === "string" && message.length > 0) {
			return message;
		}
	}
	return error instanceof Error ? error.message : fallback;
}

const WORKSPACE_NAME_MAX_LENGTH = 50;

export default function WorkspaceSelectionPage() {
	const t = useTranslations();
	const router = useRouter();
	const [tenants, setTenants] = useState<unknown[]>([]);
	const [selectedTenantId, setSelectedTenantId] = useState("");
	const [loading, setLoading] = useState(true);
	const [workspaceName, setWorkspaceName] = useState("");
	const [creating, setCreating] = useState(false);
	const [createError, setCreateError] = useState("");

	useEffect(() => {
		const timeoutId = window.setTimeout(() => {
			try {
				const profileText = window.localStorage.getItem("profile");
				const profile: unknown = profileText ? JSON.parse(profileText) : null;
				setTenants(getTenants(profile));
			} catch {
				setTenants([]);
			} finally {
				setLoading(false);
			}
		}, 0);

		return () => window.clearTimeout(timeoutId);
	}, []);

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

	// New accounts (e.g. straight after sign-up) have no workspace yet.
	// Mirrors customer-messenger's OnboardingTenant: create the tenant,
	// then reload the profile so the new membership is listed.
	async function createWorkspace(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setCreateError("");

		const name = workspaceName.trim();
		if (!name) {
			setCreateError(t("workspace.create.required"));
			return;
		}
		if (name.length > WORKSPACE_NAME_MAX_LENGTH) {
			setCreateError(t("workspace.create.tooLong"));
			return;
		}

		const jwt = window.localStorage.getItem("jwt");
		if (!jwt) {
			const locale = window.localStorage.getItem("preferredLocale") === "sv" ? "sv" : "en";
			router.push(`/${locale}/auth/signin`);
			return;
		}

		setCreating(true);
		try {
			const headers = { Authorization: `Bearer ${jwt}` };
			const tenantResponse = await axios.post<unknown>(
				`${API_HOST}/api/tenant`,
				{ data: { name, url: name } },
				{ headers },
			);
			const profileResponse = await axios.get<unknown>(`${API_HOST}/api/auth/me`, { headers });
			const profile = profileResponse.data;

			window.localStorage.setItem("profile", JSON.stringify(profile));
			setTenants(getTenants(profile));

			const createdId = asRecord(tenantResponse.data)?.id;
			if (typeof createdId === "string" || typeof createdId === "number") {
				setSelectedTenantId(String(createdId));
			}
			setWorkspaceName("");
		} catch (error) {
			setCreateError(getRequestError(error, t("workspace.create.error")));
		} finally {
			setCreating(false);
		}
	}

	return (
		<main className="flex min-h-screen items-center justify-center bg-[#f3f5f0] px-5 py-10">
			<section className="w-full max-w-lg border border-black/10 bg-white px-6 py-8 shadow-[0_18px_60px_rgba(35,49,39,0.08)] sm:px-10 sm:py-10">
				<div className="flex h-11 w-11 items-center justify-center bg-primary/10 text-primary">
					<Building2 aria-hidden="true" className="h-5 w-5" />
				</div>
				<h1 className="mt-7 text-3xl font-semibold text-[#202820]">{t("workspace.title")}</h1>
				<p className="mt-3 text-sm text-muted-foreground">{t("workspace.description")}</p>

				<div className="mt-8 space-y-2">
					<label htmlFor="workspace-select" className="text-sm font-medium">{t("workspace.label")}</label>
					{loading ? (
						<p className="py-3 text-sm text-muted-foreground" role="status">{t("workspace.loading")}</p>
					) : workspaces.length > 0 ? (
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
					) : (
						<p className="py-3 text-sm text-muted-foreground" role="status">{t("workspace.empty")}</p>
					)}
				</div>

				{!loading && workspaces.length === 0 && (
					<form className="mt-6 space-y-2" onSubmit={createWorkspace} noValidate>
						<label htmlFor="workspace-name" className="text-sm font-medium">{t("workspace.create.label")}</label>
						<Input
							id="workspace-name"
							name="workspaceName"
							autoComplete="organization"
							placeholder={t("workspace.create.placeholder")}
							maxLength={WORKSPACE_NAME_MAX_LENGTH}
							value={workspaceName}
							onChange={(event) => setWorkspaceName(event.target.value)}
						/>
						{createError && <p className="text-sm text-destructive" role="alert">{createError}</p>}
						<Button type="submit" variant="outline" className="w-full" disabled={creating}>
							{creating ? t("workspace.create.submitting") : t("workspace.create.action")}
						</Button>
					</form>
				)}

				<Button
					type="button"
					className="mt-6 w-full"
					disabled={loading || workspaces.length === 0 || selectedTenantId === ""}
					onClick={continueToTools}
				>
					{t("workspace.continue")}
				</Button>
			</section>
		</main>
	);
}
