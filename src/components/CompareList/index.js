import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Repository } from "./styles";

const CompareList = ({ repositories, removeRepository, updateRepository }) => (
    <Container>
        {repositories.map(repository => (
            <Repository key={repository.id}>
                <i
                    className="fa fa-window-close"
                    onClick={() => removeRepository(repository.id)}
                />

                <header>
                    <img src={repository.owner.avatar_url} alt="" />
                    <strong>{repository.name}</strong>
                    <small>{repository.owner.login}</small>
                </header>
                <ul>
                    <li>
                        {repository.stargazers_count} <small>stars</small>
                    </li>
                    <li>
                        {repository.forks_count} <small>forks</small>
                    </li>
                    <li>
                        {repository.open_issues_count} <small>issues</small>
                    </li>
                    <li>
                        {repository.lastCommit} <small>last commit</small>
                    </li>
                </ul>
                <button onClick={() => updateRepository(repository.id)}>
                    Update
                </button>
            </Repository>
        ))}
    </Container>
);

CompareList.propTypes = {
    repositories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            owner: PropTypes.shape({
                login: PropTypes.string,
                avatar_url: PropTypes.string
            }),
            stargazers_count: PropTypes.number,
            forks_count: PropTypes.number,
            open_issues_count: PropTypes.number,
            pushed_at: PropTypes.string
        })
    ).isRequired
};

export default CompareList;
