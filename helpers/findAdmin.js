import {FIND_ADMIN} from '../query/finduser.js'
const findadmin = async (variables) => {
    const fetchResponse = await fetch(
        "http://localhost:2000/v1/graphql",
        {
            method: 'POST',
            headers:{
                'x-hasura-admin-secret': 'secret'
              },
            body: JSON.stringify({
                query: FIND_ADMIN,
                variables: variables
            })
        }
    );
    console.log('here is well')
    const data = await fetchResponse.json();
    console.log('DEBUG: ',data);
    // const sth = HASURA_GRAPGHQL_ENDPOINT
    // console.log(sth)
    return data;
};
export {findadmin};