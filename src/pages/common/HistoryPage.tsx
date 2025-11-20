"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Card,
  Chip,
  Typography,
  Paper,
  InputAdornment,
  Stack,
  Pagination,
  Checkbox,
  IconButton,
} from "@mui/material";
import {
  History,
  Search,
  SortByAlpha,
  OpenInNew,
  Checklist,
  DeleteOutline,
  SelectAll,
  Delete,
} from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import UserMenu from "@/components/common/UserMenu";
import { useToast } from "@/contexts/ToastProvider";
import ProjectDetailsDialog from "@/components/common/PlanDetailDialog";

interface PlanRecord {
  id: string;
  name: string;
  description: string;
  version: string;
  status?: string;
  created_at: string;
  updated_at: string;
}

const GET_ALL_PROJECT_ENDPOINT = "/api/v1/projects/all/";
const DELETE_MULTIPLE_ENDPOINT = "/api/v1/projects/delete-multiple/";

export default function HistoryPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<any>();
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

  const handleViewDetail = async (id: string) => {
    try {
      setDetailLoading(true);
      const res = await axiosPrivate.get(`/api/v1/projects/${id}/detail/`);
      const { data } = res.data;
      setPlan(data);
      setOpen(true);
    } catch (error) {
      console.log(error);
      showToast(String(error), "error");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleSelectMode = () => {
    setMultiSelectMode((s) => {
      if (s) setSelectedIds([]); // clear selections when turning off
      return !s;
    });
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((x) => x !== id);
    });
  };

  const handleDelete = async (ids: string[]) => {
    const isMultiple = ids.length > 1;
    const ok = window.confirm(
      isMultiple
        ? `Delete ${ids.length} selected plan(s)? This cannot be undone.`
        : "Are you sure you want to delete this plan?"
    );
    if (!ok) return;

    try {
      setDeleting(true);
      await axiosPrivate.post(DELETE_MULTIPLE_ENDPOINT, { ids });
      setPlans((p) => p.filter((pl) => !ids.includes(pl.id)));

      if (isMultiple) {
        setSelectedIds([]);
        setMultiSelectMode(false);
      }

      showToast(
        isMultiple ? "Deleted selected plans." : "Deleted plan.",
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast(
        `Failed to delete ${isMultiple ? "selected plans" : "plan"}.`,
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    console.log(plan);
  }, [plan]);
  const fetchPlans = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axiosPrivate.get(
        `${GET_ALL_PROJECT_ENDPOINT}?page=${page}`
      );
      const { data, meta } = res.data;
      setPlans(data || []);
      setCurrentPage(meta?.page || 1);
      setTotalPages(meta?.total_pages || 1);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      showToast(String(error), "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans(currentPage);
  }, [currentPage]);

  // === Lọc và sắp xếp client-side ===
  const filteredPlans = useMemo(() => {
    if (!plans) return [];
    const filtered = plans.filter(
      (plan) =>
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "newest")
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    else if (sortBy === "oldest")
      filtered.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    else if (sortBy === "name")
      filtered.sort((a, b) => a.name.localeCompare(b.name));

    return filtered;
  }, [plans, searchQuery, sortBy]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Box sx={{ minHeight: "100vh", background: "#000", pb: 10 }}>
      {/* Header */}
      <Box
        sx={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          background: "rgba(0,0,0,0.5)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 20px rgba(168,85,247,0.5)",
                }}
              >
                <History sx={{ color: "white" }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Plan History
              </Typography>
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, ml: "auto" }}
            >
              <UserMenu user={auth} />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Search + Sort */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 3,
          }}
        >
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              fullWidth
              placeholder="Search by project name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "rgba(255,255,255,0.5)" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  background: "rgba(0,0,0,0.4)",
                  color: "white",
                  borderRadius: 2,
                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.1)",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(168,85,247,0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#a855f7",
                  },
                },
              }}
            />

            <Button
              startIcon={<SortByAlpha />}
              onClick={() => {
                const next =
                  sortBy === "newest"
                    ? "oldest"
                    : sortBy === "oldest"
                    ? "name"
                    : "newest";
                setSortBy(next);
              }}
              sx={{
                color: "#a855f7",
                border: "1px solid rgba(168,85,247,0.3)",
                textTransform: "none",
              }}
            >
              {sortBy === "newest"
                ? "Newest"
                : sortBy === "oldest"
                ? "Oldest"
                : "Name"}
            </Button>
          </Box>
        </Paper>
        <Box
          sx={{
            display: "flex",
            // justifyContent: "space-between",
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          {/* LEFT side: Select All (only visible in multi-select mode) */}
          {/* {multiSelectMode ? (
            <IconButton
                  onClick={() => {
                    if (selectedIds.length === filteredPlans.length)
                      setSelectedIds([]);
                    else setSelectedIds(filteredPlans.map((p) => p.id));
                  }}
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                  title={
                    selectedIds.length === filteredPlans.length
                      ? "Unselect all"
                      : "Select all"
                  }
                >
                  <SelectAll />
                </IconButton>
          ) : (
            <Box /> // giữ không gian cân đối
          )} */}

          {/* RIGHT side: Delete + Checklist */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            {multiSelectMode && (
              <Box>
                <IconButton
                  onClick={() => {
                    if (selectedIds.length === filteredPlans.length)
                      setSelectedIds([]);
                    else setSelectedIds(filteredPlans.map((p) => p.id));
                  }}
                  sx={{ color: "rgba(255,255,255,0.8)" }}
                  title={
                    selectedIds.length === filteredPlans.length
                      ? "Unselect all"
                      : "Select all"
                  }
                >
                  <SelectAll />
                </IconButton>
                <Button
                  onClick={() => handleDelete(selectedIds)}
                  disabled={selectedIds.length === 0 || deleting}
                  startIcon={<DeleteOutline />}
                  sx={{
                    color: "#fff",
                    background: "transparent",
                    textTransform: "none",
                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                    },
                  }}
                >
                  Delete Selected ({selectedIds.length})
                </Button>
              </Box>
            )}

            <IconButton
              onClick={() => handleToggleSelectMode()}
              sx={{ color: "rgba(255,255,255,0.8)" }}
              title={multiSelectMode ? "Exit multi-select" : "Multi-select"}
            >
              <Checklist />
            </IconButton>
          </Box>
        </Box>

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <Typography sx={{ color: "white" }}>Loading...</Typography>
          </Box>
        ) : filteredPlans.length > 0 ? (
          <>
            <Stack spacing={3}>
              {filteredPlans.map((plan) => (
                <Card
                  key={plan.id}
                  sx={{
                    p: 3,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 3,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    "&:hover": {
                      borderColor: "rgba(168,85,247,0.5)",
                      background: "rgba(255,255,255,0.05)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {multiSelectMode && (
                      <Checkbox
                        checked={selectedIds.includes(plan.id)}
                        onChange={(e) =>
                          handleToggleSelect(plan.id, e.target.checked)
                        }
                        sx={{ color: "white" }}
                      />
                    )}

                    <Box>
                      <Typography
                        variant="h6"
                        sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
                      >
                        {plan.name}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          // justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          sx={{
                            color: "#a855f7",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                          label={"v" + plan.version}
                        ></Chip>
                        <Chip
                          sx={{
                            color: "#55f786ff",
                            fontWeight: 600,
                            fontSize: "0.9rem",
                          }}
                          label={plan.status}
                        ></Chip>
                      </Box>

                      <Typography
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.95rem",
                          mb: 1,
                        }}
                      >
                        {plan.description}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(255,255,255,0.5)" }}
                      >
                        Created: {formatDate(plan.created_at)} — Updated:{" "}
                        {formatDate(plan.updated_at)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <IconButton
                      // endIcon={}
                      onClick={() => handleViewDetail(plan.id)}
                      disabled={detailLoading}
                      sx={{
                        background: "transparent",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #9333ea 0%, #db2777 100%)",
                        },
                      }}
                    >
                      <OpenInNew />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete([plan.id])}
                      // startIcon={}
                      disabled={deleting || detailLoading}
                      sx={{
                        background: "transparent",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        borderRadius: 2,
                        px: 3,
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)",
                        },
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                sx={{
                  "& .MuiPaginationItem-root": { color: "white" },
                  "& .Mui-selected": {
                    background:
                      "linear-gradient(135deg,#a855f7 0%,#ec4899 100%) !important",
                    color: "white",
                  },
                }}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "200px",
            }}
          >
            <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
              No plans found.
            </Typography>
          </Box>
        )}
      </Container>
      <ProjectDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        project={plan}
      />
    </Box>
  );
}
