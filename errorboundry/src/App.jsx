import React from "react";

// Class component required — error boundary lifecycle methods
// (getDerivedStateFromError, componentDidCatch) only exist on classes
class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false // tracks if a child crashed
    };
  }

  // Static = React calls it during render phase, before commit.
  // Just returns the state patch, doesn't apply it itself.
  static getDerivedStateFromError(error) {
    return { hasError: true }; // React merges this into instance state
  }

  // Runs after state update (commit phase) — safe place for side effects
  componentDidCatch(err, info) {
    console.error('Error Caught :', err, info); // info = component stack trace
  }

  render() {
    // this.state.hasError was updated by React using the static method's return value
    if (this.state.hasError) {
      return (
        <div style={{ border: '2px solid black', height: '400px', width: '250px', color: 'peachpuff', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}>
          Error in this Component
        </div>
      );
    }

    // No crash -> render children normally
    return this.props.children;
  }
}

function App() {
  return (
    <>
      <div style={{ border: '2px solid black', display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '20px' }}>
        {/* Each ErrorBoundary is isolated — one crashing doesn't affect the other */}
        <ErrorBoundry>
          <Card bool={true} />
        </ErrorBoundry>
        <ErrorBoundry>
          <Card bool={false} />
        </ErrorBoundry>
      </div>
    </>
  );
}

function Card({ bool }) {
  if (bool) {
    throw new Error("Randomly crashed"); // caught by nearest ErrorBoundary above
  }
  return (
    <div style={{ border: '2px solid black', height: '400px', width: '250px', color: 'peachpuff', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'black' }}>
      Random Content
    </div>
  );
}

export default App;