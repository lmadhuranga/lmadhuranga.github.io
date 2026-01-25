---
layout: chatgpt
title: "Next.js & React Pitfall Questions (With Fixes)"
date: 2026-01-25
---

### ❌ useEffect Infinite Loop

**Problem**

```jsx
useEffect(() => {
  setCount(count + 1);
}, [count]);
```

**Why it’s wrong**
`setCount` updates `count`, which triggers the effect again → infinite loop.

**Fix**

```jsx
useEffect(() => {
  setCount(prev => prev + 1);
}, []);
```

---

### ❌ Stale Closure

**Problem**

```jsx
useEffect(() => {
  setTimeout(() => {
    console.log(count);
  }, 1000);
}, []);
```

**Why it’s wrong**
The effect captures the **initial value** of `count`.

**Fix**

```jsx
useEffect(() => {
  const id = setTimeout(() => {
    console.log(count);
  }, 1000);

  return () => clearTimeout(id);
}, [count]);
```

---

### ❌ Conditional Hooks

**Problem**

```jsx
if (isLoggedIn) {
  useEffect(() => {
    fetchData();
  }, []);
}
```

**Why it’s wrong**
Hooks must be called **unconditionally** and in the same order.

**Fix**

```jsx
useEffect(() => {
  if (isLoggedIn) {
    fetchData();
  }
}, [isLoggedIn]);
```

---

### ❌ Async useEffect

**Problem**

```jsx
useEffect(async () => {
  await fetchData();
}, []);
```

**Why it’s wrong**
`useEffect` must return either nothing or a cleanup function — not a Promise.

**Fix**

```jsx
useEffect(() => {
  const load = async () => {
    await fetchData();
  };

  load();
}, []);
```

---

### ❌ Missing Dependency

**Problem**

```jsx
useEffect(() => {
  fetchData(id);
}, []);
```

**Why it’s wrong**
`id` is used but not listed → stale data bug.

**Fix**

```jsx
useEffect(() => {
  fetchData(id);
}, [id]);
```

---

### ⚠️ State Pitfalls

### ❌ setState Using Old State

**Problem**

```jsx
setCount(count + 1);
setCount(count + 1);
```

**Why it’s wrong**
Both updates read the same stale value.

**Fix**

```jsx
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

---

### ❌ Derived State Anti-Pattern

**Problem**

```jsx
const [fullName, setFullName] = useState(
  firstName + " " + lastName
);
```

**Why it’s wrong**
State derived from state causes **sync bugs**.

**Fix**

```jsx
const fullName = `${firstName} ${lastName}`;
```

---

### ❌ Using Ref Instead of State

**Problem**

```jsx
const count = useRef(0);
return <p>{count.current}</p>;
```

**Why it’s wrong**
Refs don’t trigger re-renders.

**Fix**

```jsx
const [count, setCount] = useState(0);
```

---

### ⚠️ Performance Pitfalls

### ❌ Wrong Key Usage

**Problem**

```jsx
items.map((item, index) => (
  <li key={index}>{item}</li>
));
```

**Why it’s wrong**
Index keys break reconciliation on reorder.

**Fix**

```jsx
items.map(item => (
  <li key={item.id}>{item.name}</li>
));
```

---

### ❌ useMemo With Empty Deps

**Problem**

```jsx
const value = useMemo(() => compute(data), []);
```

**Why it’s wrong**
`data` changes won’t recompute.

**Fix**

```jsx
const value = useMemo(() => compute(data), [data]);
```

---

### ❌ useCallback Trap

**Problem**

```jsx
const handleClick = useCallback(() => {
  console.log(count);
}, []);
```

**Why it’s wrong**
`count` is frozen to its initial value.

**Fix**

```jsx
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

---

### ❌ Memoizing JSX

**Problem**

```jsx
const view = useMemo(() => <Child />, []);
```

**Why it’s wrong**
JSX creation is cheap — this adds complexity for nothing.

**Fix**

```jsx
<Child />
```

---

### ❌ React.memo False Optimization

**Problem**

```jsx
const Child = React.memo(({ user }) => {
  return <p>{user.name}</p>;
});

<Child user={{ name: "John" }} />
```

**Why it’s wrong**
New object reference → re-render anyway.

**Fix**

```jsx
const user = useMemo(() => ({ name: "John" }), []);
<Child user={user} />
```

---

### ⚠️ Async & Data Pitfalls

### ❌ Race Condition

**Problem**

```jsx
useEffect(() => {
  fetchUser(id).then(setUser);
}, [id]);
```

**Why it’s wrong**
Older requests can overwrite newer ones.

**Fix**

```jsx
useEffect(() => {
  let active = true;

  fetchUser(id).then(user => {
    if (active) setUser(user);
  });

  return () => {
    active = false;
  };
}, [id]);
```

---

### ⚠️ Context Pitfalls

### ❌ Context Re-render Explosion

**Problem**

```jsx
<AuthContext.Provider value={{ user, logout }}>
```

**Why it’s wrong**
New object → all consumers re-render.

**Fix**

```jsx
const value = useMemo(() => ({ user, logout }), [user, logout]);

<AuthContext.Provider value={value}>
```

---

### ✅ Final Thought

Most React / Next.js bugs aren’t syntax issues —
they’re **state, closure, and lifecycle misunderstandings**.

If you can explain *why* these break and *how* to fix them,
you’re already thinking at a senior level.