import { PaginationData } from "@/lib/types/pagination";
import {
  Box,
  Table as MuiTable,
  TableProps as MuiTableProps,
  Paper,
  styled,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import Pagination from "./Pagination";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "var(--mui-palette-info-200)",
    color: theme.palette.common.white,
    fontWeight: 600,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.grey[100],
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export interface RowDef {
  id: string | number;
  [key: string]: React.ReactNode;
}

export interface ColumnDef<T> {
  field: string;
  headerName: string;
  render?: (row: T) => React.ReactNode;
  width?: number;
}

export type TableProps = MuiTableProps & {
  columns: ColumnDef<RowDef>[];
  onPageSwitch: (page: number) => void;
  rows: PaginationData<unknown>;
};

const TableMemo = (props: TableProps) => {
  const { columns, onPageSwitch, rows } = props;
  const pages = Math.ceil(props.rows.total / (props.rows.limit || 10));

  const renderTableBody = () => {
    if (rows.items.length === 0) {
      return (
        <StyledTableRow>
          <StyledTableCell colSpan={columns.length} align="center">
            <Typography variant="caption" className="text-[14px]">
              没有数据.
            </Typography>
          </StyledTableCell>
        </StyledTableRow>
      );
    }

    return rows.items.map((item, rid) => {
      const row = item as RowDef;
      return (
        <StyledTableRow key={row.id}>
          {columns.map((column, cid) => {
            const item = () => {
              if (column.render) {
                return column.render(row);
              }

              return row[column.field] as React.ReactNode;
            };

            if (cid === 0) {
              return (
                <StyledTableCell
                  key={`r-${rid}-c-${cid}`}
                  component="th"
                  scope="row"
                >
                  {item()}
                </StyledTableCell>
              );
            }

            return (
              <StyledTableCell
                key={`r-${rid}-c-${cid}`}
                align="center"
                width={column.width ? `${column.width!}%` : ""}
                sx={{
                  maxWidth: `${column.width || 100}vw`,
                }}
              >
                {item()}
              </StyledTableCell>
            );
          })}
        </StyledTableRow>
      );
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <TableContainer component={Paper}>
        <MuiTable stickyHeader size="medium">
          <TableHead>
            <StyledTableRow>
              {columns.map((column, index) => {
                return (
                  <StyledTableCell
                    key={`column-${index}`}
                    align={index === 0 ? "left" : "center"}
                  >
                    {column.headerName}
                  </StyledTableCell>
                );
              })}
            </StyledTableRow>
          </TableHead>

          <TableBody>{renderTableBody()}</TableBody>
        </MuiTable>
      </TableContainer>

      <Box display={"flex"} flexDirection={"row-reverse"}>
        {pages > 0 && (
          <Pagination
            count={pages}
            color="error"
            page={props.rows.page!}
            onChange={(_, page) => onPageSwitch(page)}
          />
        )}
      </Box>
    </div>
  );
};

export const Table = React.memo(TableMemo);
