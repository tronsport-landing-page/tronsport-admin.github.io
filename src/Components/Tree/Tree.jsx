import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import "./Tree.css";
const baseTree = [
  {
    name: "item1",
  },
  {
    name: "item2",
    isOpen: true,
    children: [
      {
        name: "2-item1",
        isOpen: true,
      },
    ],
  },
  {
    name: "item3",
    isOpen: true,
    children: [
      {
        name: "3-item1",
      },
      {
        name: "3-item2",
        isOpen: false,
        children: [{ name: "3.2-item 1" }],
      },
    ],
  },
  {
    name: "item4",
    isOpen: true,
    children: [
      {
        name: "4-item1",
      },
      {
        name: "4-item2",
        isOpen: true,
        children: [{ name: "4.2-item 1" }],
      },
    ],
  },
];

const TreeLine = styled.button`
  font-family: Menlo, Consolas, monospace;
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-transform: uppercase;
`;

function AddItem({ parent, funcs }) {
  return (
    <li>
      <TreeLine onClick={() => funcs.addChild(parent)}>+</TreeLine>
    </li>
  );
}

function TreeItem({ item, funcs }) {
  const { toggleOpen, makeParent } = funcs;
  return (
    <li>
      <TreeLine
      key={item.name}
        onClick={() => toggleOpen(item)}
        onDoubleClick={() => makeParent(item)}
      >
        {item.children && <span>{item.isOpen ? "-" : "+"}</span>}
        {item.name}
      </TreeLine>
      {item.children && item.isOpen && (
        <TreeList item={item} tree={item.children} funcs={funcs} />
      )}
    </li>
  );
}

function TreeList({ item, tree, funcs }) {
  console.log(tree);
  return (
    <ul>
      {tree.map((child,i) => (
        <TreeItem key={i} item={child} funcs={funcs} />
      ))}
      {/* <AddItem parent={item} funcs={funcs} /> */}
    </ul>
  );
}

function Tree({data}) {
  const [tree, setTree] = useState(data);

  useEffect(()=>{
    setTree(data)
  },[data])

  console.log(data);

  const toggleOpen = (item) => {
    const newTree = [...tree];
    item.isOpen = !item.isOpen;
    setTree(newTree);
  };
  const makeParent = (item) => {
    const newTree = [...tree];
    item.children = [];
    setTree(newTree);
  };
  const addChild = (parent) => {
    const newTree = [...tree];
    if (!parent) {
      newTree.push({ name: "New Item" });
    } else {
      parent.children.push({ name: "New Item" });
    }
    setTree(newTree);
  };

  const funcs = {
    toggleOpen,
    addChild,
    makeParent,
  };
  return (
    <div className="Tree">
      <TreeList tree={tree} funcs={funcs} />
    </div>
  );
}

export default Tree;
