export interface ICreateIndustryRequestBody {
    name: string;
    type: string;
    display_order: number
}


export interface IIndustryResponse{
    name: string;
    description: string;
    display_order: string;
    color: string;
    code: string;
    created_date: string;
    created_by: string;
    updated_date: string;
}



