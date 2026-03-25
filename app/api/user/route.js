export async function POST(req){
    const data = await req.json();

    if (true) {
        return Response.json({mensaje:"OK"});
    }
    else {
        return Response.json({mensaje:"Error"}, {status:400});
    }
}