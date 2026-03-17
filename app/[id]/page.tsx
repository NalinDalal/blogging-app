
import { use } from 'react'

/*interface Props{
    params:{
        id:Number
    }
}*/

//react.use can't be used, server route
//can't wrap it inside await cause server function
//params is a promise, so we can use use to resolve it, but we can also just await it directly in the function body since it's a server component.

const allowedId=[1,2,3]

export default async function slug(
    {params}:{params:
        Promise<{id:string}>}
){
    //forgot to extract the id from params as argument, and also forgot to await the params promise, which caused the error. Also, I should have converted the id to a number before checking if it's in allowedId.
    const {id}=await params ;

    /* fumbled this one*/
    if(!allowedId.includes(Number(id))){
        return <h1>Blog post not found</h1>
    }

    return (
    <div>
        <h1> id:</h1>
        <h1>{id}</h1>
        <h2>Blog Post {id}</h2>
    </div>
    )
    
}

//used ai to mitigate this, then was asked what about allowedID, so i said check with a array simply
//but didn;t implemented it