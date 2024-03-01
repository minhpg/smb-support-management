"use client";

import { useSupabaseContext } from "@/app/dashboard/contexts/SupabaseClient.context";
import {
  NumberInput,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Text,
  TextInput,
} from "@tremor/react";
import { useEffect, useState } from "react";

const LoadRequestItems = ({ equipmentRequestId }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const { supabase } = useSupabaseContext();

  useEffect(() => {
    const loadItemsAsync = async () => {
      const { data: requestItems } = await supabase
        .from("equipment_request_items")
        .select("*")
        .eq("equipment_request", equipmentRequestId);
      setItems(requestItems);
      setLoading(false);
    };
    loadItemsAsync();
  }, [equipmentRequestId, supabase]);

  return (
    <>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <Table>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>#{index + 1}</TableCell>
                <TableCell>
                  <TextInput value={item.name} disabled />
                </TableCell>
                <TableCell>
                  <NumberInput value={item.amount} disabled />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default LoadRequestItems;
