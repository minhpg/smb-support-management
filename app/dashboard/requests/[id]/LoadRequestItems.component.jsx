"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Col,
  Flex,
  Grid,
  NumberInput,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Text,
  TextInput,
} from "@tremor/react";
import { useEffect, useState } from "react";

const LoadRequestItems = ({ equipmentRequestId }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const supabase = createClientComponentClient();

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
  }, []);

  return (
    <>
      {loading && <Text>Loading...</Text>}
      {!loading && (
        <Table>
          {/* <TableHead>
            <TableRow>
              <TableHeaderCell></TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
            </TableRow>
          </TableHead> */}
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
