// app/providers/ErrorBoundary.js
import React from "react";
import PropTypes from "prop-types";
import ErrorPage from "shared/ui/ErrorPage";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err, info) {
    // enviar a tu logger/sentry si quieres
    // console.error(err, info);
  }
  render() {
    if (this.state.hasError) {
      return <ErrorPage onRetry={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}
ErrorBoundary.propTypes = { children: PropTypes.any };
