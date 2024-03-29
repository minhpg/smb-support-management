"use client";

import { Table, TableBody, TableCell, TableRow, Text } from "@tremor/react";
import { useEffect, useState } from "react";

import ApprovalStatus from "../../components/ApprovalStatus.component";
import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";

const LoadApprovals = ({ updateId }) => {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);

  const { supabase } = useSupabaseContext();

  useEffect(() => {
    const loadItemsAsync = async () => {
      const { data: approvalGroups } = await supabase
        .from("update_approvals")
        .select("*, group (*, campus (*))")
        .eq("update", updateId)
        .order("index", { ascending: true });

      setApprovals(approvalGroups);
      setLoading(false);
    };
    loadItemsAsync();
  }, [supabase, updateId]);

  return (
    <>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <Table>
          <TableBody>
            {approvals.map(({ group, approved, rejected }, index) => (
              <TableRow key={group.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.campus ? group.campus.name : ""}</TableCell>
                <TableCell>
                  <ApprovalStatus
                    approval={{
                      approved,
                      rejected,
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default LoadApprovals;
