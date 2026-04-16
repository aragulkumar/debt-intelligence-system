"use client";

import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api";
import type { UserRisk } from "@/types";
import { useMemo } from "react";

// Dynamically import ECharts to avoid SSR issues
const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function RiskHeatmap() {
  const { data, isLoading } = useQuery<{ data: UserRisk[] }>({
    queryKey: ["admin", "risk-heatmap"],
    queryFn: () => adminApi.getRiskHeatmap(),
  });

  const option = useMemo(() => {
    if (!data?.data?.length) return {};

    const users = data.data.slice(0, 20); // top 20 for heatmap

    // Build 2D heatmap: X=EMI Load bucket, Y=Outstanding bucket
    const xBuckets = ["0-20%", "20-40%", "40-60%", "60-80%", "80-100%"];
    const yBuckets = ["<50K", "50-200K", "200-500K", "500K-1M", ">1M"];

    const matrix: number[][] = Array.from({ length: 5 }, () => Array(5).fill(0));

    users.forEach((u) => {
      const xi = Math.min(4, Math.floor(u.emiLoadPercent / 20));
      let yi = 0;
      if (u.totalOutstanding > 1_000_000) yi = 4;
      else if (u.totalOutstanding > 500_000) yi = 3;
      else if (u.totalOutstanding > 200_000) yi = 2;
      else if (u.totalOutstanding > 50_000) yi = 1;
      matrix[yi][xi] += 1;
    });

    const heatData: [number, number, number][] = [];
    matrix.forEach((row, yi) => row.forEach((val, xi) => heatData.push([xi, yi, val])));

    return {
      backgroundColor: "transparent",
      tooltip: {
        position: "top",
        formatter: (p: { value: [number, number, number] }) =>
          `EMI: ${xBuckets[p.value[0]]}<br/>Outstanding: ${yBuckets[p.value[1]]}<br/>Users: ${p.value[2]}`,
      },
      grid: { top: "10%", left: "15%", right: "5%", bottom: "15%" },
      xAxis: {
        type: "category",
        data: xBuckets,
        axisLabel: { color: "#71717a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#27272a" } },
        splitArea: { show: true, areaStyle: { color: ["transparent", "transparent"] } },
        name: "EMI Load",
        nameTextStyle: { color: "#71717a", fontSize: 11 },
      },
      yAxis: {
        type: "category",
        data: yBuckets,
        axisLabel: { color: "#71717a", fontSize: 11 },
        axisLine: { lineStyle: { color: "#27272a" } },
        splitArea: { show: true, areaStyle: { color: ["transparent", "transparent"] } },
        name: "Outstanding",
        nameTextStyle: { color: "#71717a", fontSize: 11 },
      },
      visualMap: {
        min: 0,
        max: 5,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "2%",
        textStyle: { color: "#a1a1aa", fontSize: 11 },
        inRange: {
          color: ["#18181b", "#1e1b4b", "#3730a3", "#6366f1", "#ef4444"],
        },
      },
      series: [
        {
          name: "Users",
          type: "heatmap",
          data: heatData,
          label: {
            show: true,
            color: "#fafafa",
            fontSize: 12,
            fontWeight: "bold",
          },
          emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(99,102,241,0.4)" } },
        },
      ],
    };
  }, [data]);

  if (isLoading) return (
    <div className="animate-pulse rounded-xl p-5 border glass" style={{ borderColor: "var(--border)", height: 380 }} />
  );

  return (
    <div className="rounded-xl p-5 border glass" style={{ borderColor: "var(--border)" }}>
      <h2 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
        Risk Heatmap — EMI Load vs Outstanding Debt
      </h2>
      <ReactECharts option={option} style={{ height: 320 }} theme="dark" />
    </div>
  );
}
