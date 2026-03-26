'use client';

import React, { Component, ReactNode } from 'react';

interface Props  { children: ReactNode }
interface State  { remountKey: number; retries: number }

const MAX_RETRIES = 5;

/**
 * Catches the DOM errors triggered by Google Translate (and similar extensions)
 * that wrap text nodes in <font> elements, breaking React's virtual DOM references.
 *
 * Recovery strategy: increment `remountKey` to force React to unmount and
 * remount the subtree with a fresh DOM — up to MAX_RETRIES times to avoid loops.
 */
export class TranslationErrorBoundary extends Component<Props, State> {
  state: State = { remountKey: 0, retries: 0 };

  static getDerivedStateFromError(_error: Error): Partial<State> | null {
    // Let componentDidCatch decide whether to recover
    return null;
  }

  componentDidCatch(error: Error) {
    const isTranslationError =
      error.message.includes('insertBefore') ||
      error.message.includes('removeChild')  ||
      error.message.includes('NotFoundError') ||
      error.name   === 'NotFoundError';

    if (isTranslationError && this.state.retries < MAX_RETRIES) {
      // Force a clean remount of the entire child tree
      this.setState((s) => ({
        remountKey: s.remountKey + 1,
        retries:    s.retries    + 1,
      }));
    }
    // If it's not a translation error or we've exceeded retries, let it propagate
  }

  render() {
    return (
      <React.Fragment key={this.state.remountKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}
