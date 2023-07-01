/* eslint-disable no-extra-boolean-cast */
import { useCallback, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { gql, useMutation, useQuery } from "@apollo/client";

// get todos
const GET_TODOS_QUERY = gql`
  query GET_TODOS_QUERY {
    todos {
      id
      title
    }
  }
`;

// add todo
const ADD_TODO_MUTATION = gql`
  mutation ADD_TODO_MUTATION($title: String!) {
    insert_todos_one(object: { title: $title }) {
      id
    }
  }
`;

// delete todo
const DELETE_TODO_BY_ID_MUTATION = gql`
  mutation DELETE_TODO_BY_ID_MUTATION($id: uuid!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;

// update todo
const UPDATE_TODO_BY_ID_MUTATION = gql`
  mutation UPDATE_TODO_BY_ID_MUTATION($id: uuid!, $title: String!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { title: $title }) {
      id
    }
  }
`;

function App() {
  const { loading, data } = useQuery(GET_TODOS_QUERY);
  const [addTodo, { loading: addTodoLoading }] = useMutation(
    ADD_TODO_MUTATION,
    {
      refetchQueries: [GET_TODOS_QUERY],
    }
  );
  const [deleteTodoById, { loading: deleteTodoByIdLoading }] = useMutation(
    DELETE_TODO_BY_ID_MUTATION,
    {
      refetchQueries: [GET_TODOS_QUERY],
    }
  );
  const [updateTodoById, { loading: updateTodoByIdLoading }] = useMutation(
    UPDATE_TODO_BY_ID_MUTATION,
    {
      refetchQueries: [GET_TODOS_QUERY],
    }
  );
  const [title, setTitle] = useState("");
  const [todoId, setTodoId] = useState("");

  // handle add todo callback
  const handleAddTodo = useCallback(() => {
    addTodo({
      variables: {
        title,
      },
    });
    setTitle("");
  }, [addTodo, title]);

  // handle update todo callback
  const handleUpdateTodo = useCallback(() => {
    updateTodoById({
      variables: {
        id: todoId,
        title,
      },
    });
    setTodoId("");
    setTitle("");
  }, [todoId, title]);

  return (
    <>
      <div className="App">
        {/* loading */}
        {(loading ||
          addTodoLoading ||
          deleteTodoByIdLoading ||
          updateTodoByIdLoading) && <div>Loading...</div>}

        {/* add todo */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add todo"
        />
        {!!todoId ? (
          <button onClick={handleUpdateTodo}>Update Todo</button>
        ) : (
          <button onClick={handleAddTodo}>Add Todo</button>
        )}

        {data?.todos.map((todo: { title: string; id: string }) => (
          <div key={todo.id}>
            <p>{todo.title}</p>
            <button
              onClick={() => {
                setTodoId(todo.id);
                setTitle(todo.title);
              }}
            >
              Edit
            </button>
            <button
              onClick={() =>
                deleteTodoById({
                  variables: {
                    id: todo.id,
                  },
                  refetchQueries: [{ query: GET_TODOS_QUERY }],
                })
              }
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
