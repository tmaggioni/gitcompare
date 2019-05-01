import React, { Component } from "react";
import logo from "../../assets/logo.png";
import api from "../../services/api";
import { Container, Form } from "./styles";
import moment from "moment";

import CompareList from "../../components/CompareList";

export default class Main extends Component {
    state = {
        repositoryInput: "",
        repositoryError: false,
        repositories: [],
        isLoading: false
    };

    componentDidMount() {
        if (localStorage.repositories) {
            this.setState({
                repositories: JSON.parse(localStorage.repositories)
            });
        }
    }
    handleAddRepository = async e => {
        e.preventDefault();
        this.setState({
            isLoading: true
        });
        try {
            const { data: repository } = await api.get(
                `/repos/${this.state.repositoryInput}`
            );

            repository.lastCommit = moment(repository.pushed_at).fromNow();

            this.setState({
                repositories: [...this.state.repositories, repository],
                repositoryInput: "",
                repositoryError: false
            });
            localStorage.repositories = JSON.stringify(this.state.repositories);
        } catch (err) {
            this.setState({ repositoryError: true });
        } finally {
            this.setState({
                isLoading: false
            });
        }
    };

    handleRemoveRepository = async id => {
        const updatedRepositories = this.state.repositories.filter(
            repository => {
                return repository.id !== id;
            }
        );
        this.setState({ repositories: updatedRepositories });

        await localStorage.setItem(
            "repositories",
            JSON.stringify(updatedRepositories)
        );
    };

    handleUpdateRepository = async id => {
        const selectedRepo = this.state.repositories.find(repository => {
            return repository.id == id;
        });

        try {
            const { data } = await api.get(`/repos/${selectedRepo.full_name}`);

            data.lastCommit = moment(data.pushed_at).fromNow();

            this.setState({
                repositoryInput: "",
                repositoryError: false,
                repositories: this.state.repositories.map(repo =>
                    repo.id === data.id ? data : repo
                )
            });
            localStorage.repositories = JSON.stringify(this.state.repositories);
        } catch (err) {
            this.setState({ repositoryError: true });
        }
    };

    render() {
        return (
            <Container>
                <img src={logo} alt="Github compare" />
                <Form
                    withError={this.state.repositoryError}
                    onSubmit={this.handleAddRepository}
                >
                    <input
                        type="text"
                        value={this.state.repositoryInput}
                        onChange={e =>
                            this.setState({ repositoryInput: e.target.value })
                        }
                        placeholder="Usuario/repo"
                    />
                    <button type="submit">
                        {this.state.isLoading ? (
                            <i className="fa fa-spinner fa-pulse" />
                        ) : (
                            "OK"
                        )}
                    </button>
                </Form>
                <CompareList
                    repositories={this.state.repositories}
                    removeRepository={this.handleRemoveRepository}
                    updateRepository={this.handleUpdateRepository}
                />
            </Container>
        );
    }
}
