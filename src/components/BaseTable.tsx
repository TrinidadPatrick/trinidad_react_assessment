import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    type FilterFn,
  } from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { Button } from './ui/button'
import { Input } from "./ui/input"
import { useRef, useState } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"
import { FixedSizeList } from "react-window"

  interface Languages{
    name: string
}

interface Country{
    name: string,
    capital: string,
    code: string,
    currency: string,
    emoji: string,
    languages: Languages[],
    
}

  
const BaseTable = ({countries, columns} : {countries: Country[], columns : any}) => {
    const [columnFilters, setColumnFilters] = useState<any>([])
    
    const tableQuery = useReactTable({
        data: countries,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel : getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        columnResizeMode: "onChange",
        state: {
            columnFilters
        }
    })



  return (
    <div className="flex flex-col gap-3">
        <div className="flex max-w-sm gap-2">
            {/* Language Filter */}
            <div className="w-[200px]  rounded-md">
            <Select onValueChange={(val : string) => tableQuery.getColumn("currency")?.setFilterValue(val)} defaultValue={(tableQuery.getColumn("currency")?.getFilterValue() as string) ?? ""}>
                <SelectTrigger className="w-[180px] cursor-pointer">
                    <SelectValue placeholder="Filter by currency" />
                </SelectTrigger>
                <SelectContent>
                    <FixedSizeList
                        height={350}
                        width="100%"
                        itemCount={countries.length}
                        itemSize={40}
                    >
                        {({ index, style }) => {
                            const currency = countries[index]?.currency
                            if (!currency) return null
                            return (
                            <div style={style}>
                            <SelectItem  value={currency}>{currency}</SelectItem>
                            </div>
                            )
                        }}
                    </FixedSizeList>
                </SelectContent>
            </Select>
            </div>

            <div className="w-[200px] rounded-md">
            <Select onValueChange={(val : string) => tableQuery.getColumn("languages")?.setFilterValue(val)} defaultValue={(tableQuery.getColumn("languages")?.getFilterValue() as string) ?? ""}>
                <SelectTrigger className="w-[250px] cursor-pointer">
                    <SelectValue placeholder="Filter by language" />
                </SelectTrigger>
                <SelectContent>
                    <FixedSizeList   
                        height={350}
                        width="100%"
                        itemCount={countries.length}
                        itemSize={40}
                        
                    >
                        {({ index, style }) => {
                        const langs = countries[index]?.languages?.map(l => l.name) || []
                        if (langs.length === 0) return null

                        // Remove duplicates and sort alphabetically
                        const uniqueLangs = [...new Set(langs)].sort((a, b) => a.localeCompare(b))
                        const langsString = uniqueLangs.join(", ")

                        return (
                            <div style={style}>
                            <SelectItem value={langsString}>{langsString}</SelectItem>
                            </div>
                        )
                        }}
                    </FixedSizeList>
                </SelectContent>
            </Select>
            </div>
        </div>
    
            <Table className="border table-fixed">
                <TableHeader className="border">
                {
                    tableQuery.getHeaderGroups().map((headerGroup : any) =>
                        <TableRow key={headerGroup.id} >
                            {headerGroup.headers.map((header: any) => (
                                <TableHead key={header.id} style={{width : header.column.getSize()}} className={`${header.column.getIsResizing() ? 'cursor-col-resize' : ''} border-r group text-center relative `}>
                                    {header.column.columnDef.header}

                                    <button
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        style={{ cursor: 'col-resize' }}
                                        className={`absolute top-0 right-0 w-1 h-full bg-blue-500 opacity-0 transition-opacity 
                                        ${header.column.getIsResizing() ? 'opacity-100 bg-blue-800' : 'group-hover:opacity-100'}`}
                                    />
                                </TableHead>
                            ))}
                        </TableRow>)
                }
                </TableHeader>
                <TableBody className="border">
            {
                tableQuery?.getRowModel().rows.map((row : any) =>
                <TableRow key={row.id} className="">
                    {
                        row.getVisibleCells().map((cell : any) =>
                            <TableCell key={cell.id} style={{width : cell.column.getSize()}} className="text-center border whitespace-break-spaces ">
                                {
                                    flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )
                                }
                            </TableCell>
                        )
                    }
                </TableRow>
                )
            }
                </TableBody>
            </Table>
            <div className="flex items-center justify-end space-x-2 py-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => tableQuery.previousPage()}
            disabled={!tableQuery.getCanPreviousPage()}
            >
            Previous
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => tableQuery.nextPage()}
            disabled={!tableQuery.getCanNextPage()}
            >
            Next
            </Button>
        </div>
        </div>
  )
}

export default BaseTable