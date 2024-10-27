import { NextResponse } from "next/server";
let store={};
export async function POST(req,res){
    const data =await req.json()
    console.log(data)
    store=data;
    console.log(res);
    return NextResponse.json(data)
    }
    
export async function GET(){
return NextResponse.json(store)
}