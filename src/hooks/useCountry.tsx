import fetchCountries from "@/helper/country/fetch_country";
import { useQuery} from "@tanstack/react-query";



export const useCountry = (filterValue : string) => {
    return useQuery({
        queryKey: ['country', filterValue || ""],
        queryFn: ()=>fetchCountries(filterValue),
    })
}