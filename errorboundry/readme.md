# Error Boundaries — Fault Isolation Strategy for React Apps
 
## The Problem
 
In a large website, dozens of components run on the same page at once — a navbar, a product grid, a recommendation widget, a chat widget, an ad slot, a comments section, etc.
 
By default, React has **no isolation between components**. If a single component throws an error during render, React unmounts the **entire component tree**, and the user sees a blank white screen — even if 95% of the page was working fine.
 
```
Navbar        ✅
ProductGrid   ✅
Recommendations ❌ crashes
Comments      ✅
Footer        ✅
 
Result without protection: entire page goes blank
```
 
This is a **single point of failure** — one broken widget takes down the whole app. That's not acceptable for a production website with real traffic.
 
## The Fix: Error Boundaries
 
An **Error Boundary** is a component that wraps part of the UI and "catches" errors thrown anywhere in its child tree — similar to a `try/catch` block, but for the render tree instead of a function call stack.
 
If a child crashes:
- Only the boundary's own subtree is replaced with a fallback UI
- Everything **outside** that boundary keeps running normally
- The error is logged for debugging, without taking the whole app down
```
Navbar        ✅
ProductGrid   ✅
Recommendations  → shows fallback UI instead of crashing
Comments      ✅
Footer        ✅
 
Result with boundary: rest of the page still works
```
 
This is the same principle as **redundancy/backup systems** in general engineering — isolate failures so one broken part doesn't cascade into total system failure.
 
## How It Works
 
```jsx
class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
 
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
 
  componentDidCatch(err, info) {
    console.error('Error Caught :', err, info);
  }
 
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong in this section.</div>;
    }
    return this.props.children;
  }
}
```
 
| Method | Role |
|---|---|
| `getDerivedStateFromError` | Runs first, decides the new state (pure, no side effects) |
| `componentDidCatch` | Runs after, used for logging/reporting the error |
| `render` | Shows fallback UI if `hasError` is true, otherwise renders children normally |
 
## Where This Actually Gets Used
 
Real-world sites don't wrap **one** boundary around the whole app — that would just move the single point of failure up a level. Instead, boundaries are placed around **independent sections**:
 
```jsx
<Layout>
  <ErrorBoundary><Navbar /></ErrorBoundary>
  <ErrorBoundary><ProductGrid /></ErrorBoundary>
  <ErrorBoundary><RecommendationsWidget /></ErrorBoundary>
  <ErrorBoundary><Comments /></ErrorBoundary>
  <ErrorBoundary><Footer /></ErrorBoundary>
</Layout>
```
 
Each section fails independently. A crash in `RecommendationsWidget` never touches `Comments` or `Navbar`.
 
## What Error Boundaries Do NOT Catch
 
Worth knowing so you don't rely on them for everything:
 
- Errors inside event handlers (`onClick`, `onChange`, etc.) — use a normal `try/catch` there
- Errors in async code (`setTimeout`, `fetch` callbacks, promises)
- Errors during server-side rendering
- Errors thrown in the boundary component itself (a boundary can't catch its own errors — wrap it with another boundary above it)
## Summary
 
| Without Error Boundaries | With Error Boundaries |
|---|---|
| One broken component crashes the entire app | Only the broken section fails |
| No error logging/visibility | `componentDidCatch` gives you a hook to log to Sentry/LogRocket/etc. |
| Poor user experience (blank page) | Graceful fallback UI, rest of the app usable |
| Single point of failure | Isolated, fault-tolerant sections |
 
This is the same mindset as backup power supplies, load balancer failover, or database replicas — **assume something will fail, and design so that failure stays contained.**