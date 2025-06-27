import React from "react";
import {
  Card,
  CardContent,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

interface StatusCardProps {
  label: string; // e.g. "สนใจนำเสนอโครงการ"
  count: number; // e.g. 1
  percentage: number; // e.g. 0.09  (0–100)
  size?: number; // outer diameter of the donut
  thickness?: number; // stroke width
}

export function StatusCard({
  label,
  count,
  percentage,
  size = 100,
  thickness = 6,
}: StatusCardProps) {
  return (
    <Card
      className="cursor-pointer hover:bg-gray-100 transition-all duration-300"
      sx={{
        width: "100%",
        // width: size + 24, // add some padding
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          py: 2,
        }}
      >
        {/* Donut */}
        <Box position="relative" display="inline-flex">
          {/* Track */}
          <CircularProgress
            variant="determinate"
            value={100}
            size={size}
            thickness={thickness}
            sx={{ color: (theme) => theme.palette.grey[300] }}
          />
          {/* Progress */}
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={size}
            thickness={thickness}
            sx={{
              position: "absolute",
              left: 0,
              color: (theme) => theme.palette.success.main,
            }}
          />
          {/* Center label */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            sx={{ transform: "translate(-50%, -50%)", textAlign: "center" }}
          >
            <Typography variant="h5">{count}</Typography>
            <Typography variant="caption" color="text.secondary">
              {percentage.toFixed(2)}%
            </Typography>
          </Box>
        </Box>

        {/* Bottom text */}
        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mt: 1, lineHeight: 1 }}
        >
          {label}
        </Typography>
      </CardContent>
    </Card>
  );
}
