const transactionTypeDef = `#graphql
type transaction {
    _id:ID!
    userId:Float!
    description:String!
    paymentType:String!
    category:String
    amount:Float !
    location:String
    date:String!
}

type Query{
    transactions:[transaction!]
    transaction (transactionId:ID!):Transaction
}

type Mutation {
    createTransaction (input:CreateTransactionInput !):Transaction!
    updateTransaction (input:UpdateTransactionInput !):Transaction!
    deleteTransaction (transactionId:ID !):Transaction !

}

input CreateTransaction {
    description:String!
    paymentType:String!
    category:String!
    amount:Float !
    location:String
    date:String!
}

input UpdateTransactionInput {
    transactionId:ID!
    description:String
    paymentType:String
    category:String
    amount:Float 
    location:String
    date:String
}

`;

export default transactionTypeDef;