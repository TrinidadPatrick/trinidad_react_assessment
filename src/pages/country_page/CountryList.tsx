import BaseTable from "@/components/BaseTable"
import { useCountry } from "@/hooks/useCountry"
import type { ColumnDef, FilterFn } from "@tanstack/react-table"
import { useState } from "react"

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

const CountryList = () => {
    const [filterValue, setFilterValue] = useState<string>('')

    const {data: countries, isLoading} = useCountry(filterValue)

    const languageArrayFilter: FilterFn<Country> = (row, columnId, filterValue) => {
        const languages = row.getValue<{ name: string }[]>(columnId)
        if (!filterValue) return true
        return languages.some(lang =>
          lang.name.toLowerCase().includes((filterValue as string).toLowerCase())
        )
      }

    const columns : ColumnDef<Country>[] = [
        {
            accessorKey : "name",
            header: "Country",
            size: 50,
        },
        {
            accessorKey : "capital",
            header: "Capital",
            size: 50,
        },
        {
            accessorKey : "emoji",
            header: "Flag",
            size: 50,
        },
        {
            accessorKey : "languages",
            header: "Language",
            size: 50,
            cell: (props: any) => {
                const languages = props.getValue()?.map((lang : any) => lang.name)
                return (
                    <p className=" whitespace-break-spaces">
                        {
                            languages.join(", ")
                        }
                    </p>
                )
            },
            filterFn: languageArrayFilter
        },
        {
            accessorKey : "currency",
            header: "Currency",
            size: 50,
        },
    ]


  return (
    <div className="w-full h-full flex justify-center items-center ">

        <section className="w-[90%]">
            <BaseTable 
            countries={countries || []}
            columns={columns}
            />
        </section>
    </div>
  )
}

export default CountryList