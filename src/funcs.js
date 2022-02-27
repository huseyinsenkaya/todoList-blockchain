import TodoListJSON from "../build/contracts/TodoList.json";
import Web3 from "web3";

var Contract = require("@truffle/contract");

export const load = async () => {
  await loadWeb3();
  const addressAccount = await loadAccount();
  const { contract, tasks } = await loadContract(addressAccount);

  return { addressAccount, contract, tasks };
};

const loadTasks = async (contract) => {
  const addressAccount = await web3.eth.getCoinbase();
  const tasksCount = await contract.tasksCount(addressAccount);
  const tasks = [];

  for (let i = 0; i < tasksCount; i++) {
    const task = await contract.tasks(addressAccount, i);
    tasks.push(task);
  }

  return tasks;
};

const loadContract = async (addressAccount) => {
  const todoContract = Contract(TodoListJSON);
  todoContract.setProvider(web3.eth.currentProvider);
  const contract = await todoContract.deployed();
  const tasks = await loadTasks(contract, addressAccount);

  return { contract, tasks };
};

const loadAccount = async () => {
  const addressAccount = await web3.eth.getCoinbase();
  return addressAccount;
};

const loadWeb3 = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;
};
