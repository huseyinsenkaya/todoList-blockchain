import { React, useState, useEffect } from "react";

import { load } from "../src/funcs";
import styles from "../styles/main.module.scss";

export default function Home() {
  const [input, setInput] = useState("");
  const [refresh, setRefresh] = useState(true);
  const [addressAccount, setAddressAccount] = useState("");
  const [contract, setContract] = useState({});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!refresh) return;
    setRefresh(false);
    load().then((e) => {
      setAddressAccount(e.addressAccount);
      setContract(e.contract);
      setTasks(e.tasks);
    });
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTask = async () => {
    await contract.createTask(input, { from: addressAccount });
    setInput("");
    setRefresh(true);
  };

  const handleToggle = async (id) => {
    await contract.toggleCompleted(id, { from: addressAccount });
    setRefresh(true);
  };

  return (
    <div className={`${styles.app__flex} ${styles.app__container}`}>
      <header className="app__header">
        <h1 className="head-text">Blockchain TodoList</h1>
      </header>

      <div className={`${styles.app__form} ${styles.app__flex}`}>
        <input
          type="text"
          placeholder="New Task..."
          onChange={handleInputChange}
          value={input}
        />
        <button onClick={handleAddTask}>ADD</button>
      </div>

      <div className={`${styles.app__content} ${styles.app__flex}`}>
        <h3>ToDo</h3>

        {tasks ? (
          <div className={`${styles.app__contentTasks} ${styles.app__flex}`}>
            {tasks.map((task, i) =>
              !task[2] ? (
                <div key={i}>
                  <p>{task[1]}</p>
                  <button onClick={() => handleToggle(task[0].toNumber())}>
                    DONE
                  </button>
                </div>
              ) : null
            )}
          </div>
        ) : (
          <div>Loading...</div>
        )}

        <h3>Task Done</h3>
        {tasks ? (
          <div className={`${styles.app__contentTasks} ${styles.app__flex}`}>
            {tasks.map((task, i) =>
              task[2] ? (
                <div key={i}>
                  <p>{task[1]}</p>
                  <button onClick={() => handleToggle(task[0].toNumber())}>
                    UNDONE
                  </button>
                </div>
              ) : null
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
