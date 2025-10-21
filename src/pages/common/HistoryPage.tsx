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
} from "@mui/material";
import { History, Search, SortByAlpha, OpenInNew } from "@mui/icons-material";
import useAuth from "@/hooks/useAuth";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import UserMenu from "@/components/common/UserMenu";

interface PlanRecord {
  id: string;
  name: string;
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
}

const GET_ALL_PROJECT_ENDPOINT = "/api/v1/projects/all/";

export default function HistoryPage() {
  const { auth } = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name">("newest");
  const [plans, setPlans] = useState<PlanRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // === Fetch dữ liệu phân trang ===
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
            <UserMenu user={auth} />
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

        {/* Plans */}
        {loading ? (
          <Typography sx={{ color: "white" }}>Loading...</Typography>
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
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ color: "white", fontWeight: 700, mb: 0.5 }}
                    >
                      {plan.name}
                    </Typography>
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

                  <Button
                    endIcon={<OpenInNew />}
                    sx={{
                      background:
                        "linear-gradient(135deg,#a855f7 0%,#ec4899 100%)",
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      px: 3,
                    }}
                  >
                    View
                  </Button>
                </Card>
              ))}
            </Stack>

            {/* Pagination */}
            <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
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
          <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>
            No plans found.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
