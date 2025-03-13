import { gql } from "@apollo/client";

export const GET_REPOSITORY = gql`
    query {
        repository(owner: "deepseek-ai", name: "deepseek-v3") {
            stargazerCount
            issues(last: 20, states: CLOSED) {
                                edges {
                                    node {
                        title
                        url
                        labels(first: 5) {
                                        edges {
                                        node {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
