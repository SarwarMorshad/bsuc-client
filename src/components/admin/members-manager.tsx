"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useAuth } from "@/components/auth/auth-provider";
import { listMembers, setMemberRole } from "@/lib/admin";
import { toApiError } from "@/lib/api";
import type { User } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function MembersManager() {
  const t = useTranslations("admin");
  const s = useTranslations("states");
  const locale = useLocale();
  const { user: me } = useAuth();

  const [members, setMembers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (q: string) => {
    try {
      setMembers(await listMembers(q || undefined));
      setError(null);
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced so typing does not fire a request per keystroke.
  useEffect(() => {
    const id = setTimeout(() => void load(search), 300);
    return () => clearTimeout(id);
  }, [search, load]);

  async function toggleRole(member: User) {
    setBusyId(member.id);
    setError(null);
    try {
      await setMemberRole(member.id, member.role === "ADMIN" ? "MEMBER" : "ADMIN");
      await load(search);
    } catch (err) {
      setError(toApiError(err).error);
    } finally {
      setBusyId(null);
    }
  }

  const fmt = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("search")}
        className="max-w-xs"
        aria-label={t("search")}
      />

      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {loading ? (
        <p role="status" aria-live="polite" className="text-muted-foreground">
          {s("loading")}
        </p>
      ) : members.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border px-6 py-10 text-center text-muted-foreground">
          {t("noMembers")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("statMembers")}</TableHead>
                <TableHead className="hidden md:table-cell">
                  {t("matriculation")}
                </TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead>{t("role")}</TableHead>
                <TableHead className="hidden sm:table-cell">{t("joined")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((m) => {
                const isMe = m.id === me?.id;
                return (
                  <TableRow key={m.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {m.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.avatarUrl}
                            alt=""
                            className="h-8 w-8 shrink-0 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                            {m.name.slice(0, 1).toUpperCase()}
                          </span>
                        )}
                        <span className="min-w-0">
                          <span className="flex items-center gap-1.5">
                            <span className="truncate font-medium text-foreground">
                              {m.name}
                            </span>
                            {isMe && (
                              <span className="text-xs text-muted-foreground">
                                ({t("you")})
                              </span>
                            )}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {m.email}
                          </span>
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="hidden font-mono text-xs text-muted-foreground md:table-cell">
                      {m.matriculationNumber}
                    </TableCell>

                    <TableCell>
                      <Badge variant={m.emailVerified ? "secondary" : "outline"}>
                        {m.emailVerified ? t("verified") : t("pending")}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={m.role === "ADMIN" ? "default" : "outline"}>
                        {m.role}
                      </Badge>
                    </TableCell>

                    <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                      {fmt.format(new Date(m.createdAt))}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === m.id || isMe}
                        onClick={() => toggleRole(m)}
                        // Demoting yourself is refused by the API too.
                        title={isMe ? t("you") : undefined}
                      >
                        {m.role === "ADMIN" ? t("removeAdmin") : t("makeAdmin")}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
