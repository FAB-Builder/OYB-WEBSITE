"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "@/i18n/client";
import { Button } from "@/components/ui/button";
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

export default function WorkspaceSelectionPage() {
	const t = useTranslations();
	const router = useRouter();
	const [tenants, setTenants] = useState<unknown[]>([]);
	const [selectedTenantId, setSelectedTenantId] = useState("");
	const [loading, setLoading] = useState(true);

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
