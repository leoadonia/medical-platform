"use client";

import { TextField } from "@/components/input/TextField";
import { SearchParams } from "@/lib/types/patient";
import { Button, Card, CardContent } from "@mui/material";
import { Search } from "lucide-react";
import React, { useRef } from "react";

const SearchBar = React.memo(
  ({
    onSearch,
    actions,
  }: {
    onSearch: (params: SearchParams) => void;
    actions?: React.ReactNode;
  }) => {
    const param = useRef<SearchParams>({});

    const handleNameChanged = (name: string) => {
      if (name.length === 0) {
        param.current.name = undefined;
      } else {
        param.current.name = name;
      }
    };

    const handleRegistrationChanged = (rn: string) => {
      if (rn.length === 0) {
        param.current.registration_number = undefined;
      } else {
        param.current.registration_number = rn;
      }
    };

    const handleContactChanged = (contact: string) => {
      if (contact.length === 0) {
        param.current.contact = undefined;
      } else {
        param.current.contact = contact;
      }
    };

    return (
      <Card className="w-full bg-white/80 shadow-md">
        <CardContent className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-4">
            <TextField
              label="姓名"
              variant="outlined"
              color="info"
              onValueChange={handleNameChanged}
            />
            <TextField
              label="登记号"
              variant="outlined"
              color="info"
              onValueChange={handleRegistrationChanged}
            />
            <TextField
              label="手机号"
              variant="outlined"
              color="info"
              onValueChange={handleContactChanged}
            />
          </div>
          <div className="flex gap-4">
            <Button
              startIcon={<Search className="h-4 w-4" />}
              variant="outlined"
              onClick={() => onSearch(param.current)}
              className="gap-1 px-4"
            >
              查询
            </Button>
            {actions}
          </div>
        </CardContent>
      </Card>
    );
  },
);

SearchBar.displayName = "SearchBar";

export default SearchBar;
