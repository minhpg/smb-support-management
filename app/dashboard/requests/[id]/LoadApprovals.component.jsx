"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Table, TableBody, TableCell, TableRow, Text } from "@tremor/react";
import { useEffect, useState } from "react";
import ApprovalStatus from "../ApprovalStatus.component";

const LoadApprovals = ({ updateId }) => {
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState([]);

  const supabase = createClientComponentClient();

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
