import { useLazyQuery, gql } from '@apollo/client';

const GET_ITEM = gql`
query GetItem($id: ID!){
 item(id: $id) {
   id
   label
   type
   price
   description
   modifierGroups {
     id
     label
     selectionRequiredMax
     selectionRequiredMin
     modifiers {
       displayOrder
       defaultQuantity
       priceOverride
       item {
         id
         type
         identifier
         price
       }
     }
   }
 }
}
`;

export const useItemData = () => {
  const [getItem, { loading, error, data }] = useLazyQuery(GET_ITEM, { fetchPolicy: "cache-first" });

  console.log('GraphQL Item Query Results:', {
    loading,
    error,
    data
  });

  return { getItem, loading, error, data };
};