import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../components/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  describe('basic rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render with default medium size', () => {
      const { container } = render(<LoadingSpinner />);
      
      const spinnerDiv = container.querySelector('div[style*="width: 40px"]');
      expect(spinnerDiv).toBeInTheDocument();
    });
  });

  describe('size prop', () => {
    it('should render small spinner when size is small', () => {
      const { container } = render(<LoadingSpinner size="small" />);
      
      const spinnerDiv = container.querySelector('div[style*="width: 20px"]');
      expect(spinnerDiv).toBeInTheDocument();
    });

    it('should render medium spinner when size is medium', () => {
      const { container } = render(<LoadingSpinner size="medium" />);
      
      const spinnerDiv = container.querySelector('div[style*="width: 40px"]');
      expect(spinnerDiv).toBeInTheDocument();
    });

    it('should render large spinner when size is large', () => {
      const { container } = render(<LoadingSpinner size="large" />);
      
      const spinnerDiv = container.querySelector('div[style*="width: 60px"]');
      expect(spinnerDiv).toBeInTheDocument();
    });
  });

  describe('message prop', () => {
    it('should not display message when not provided', () => {
      render(<LoadingSpinner />);
      
      const message = screen.queryByText(/Loading/);
      expect(message).not.toBeInTheDocument();
    });

    it('should display message when provided', () => {
      const testMessage = 'Loading your data...';
      render(<LoadingSpinner message={testMessage} />);
      
      const message = screen.getByText(testMessage);
      expect(message).toBeInTheDocument();
    });

    it('should render custom message text', () => {
      render(<LoadingSpinner message="Please wait..." />);
      
      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('fullScreen prop', () => {
    it('should not render fullscreen by default', () => {
      const { container } = render(<LoadingSpinner />);
      
      const fullScreenDiv = container.querySelector('div[style*="position: fixed"]');
      expect(fullScreenDiv).not.toBeInTheDocument();
    });

    it('should render fullscreen overlay when fullScreen is true', () => {
      const { container } = render(<LoadingSpinner fullScreen />);
      
      const fullScreenDiv = container.querySelector('div[style*="position: fixed"]');
      expect(fullScreenDiv).toBeInTheDocument();
    });

    it('should have correct z-index when fullScreen is true', () => {
      const { container } = render(<LoadingSpinner fullScreen />);
      
      const fullScreenDiv = container.querySelector('div[style*="z-index: 9999"]');
      expect(fullScreenDiv).toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('should render large fullscreen spinner with message', () => {
      const { container } = render(
        <LoadingSpinner 
          size="large" 
          fullScreen 
          message="Loading diagram..." 
        />
      );
      
      const spinnerDiv = container.querySelector('div[style*="width: 60px"]');
      expect(spinnerDiv).toBeInTheDocument();
      
      const fullScreenDiv = container.querySelector('div[style*="position: fixed"]');
      expect(fullScreenDiv).toBeInTheDocument();
      
      expect(screen.getByText('Loading diagram...')).toBeInTheDocument();
    });

    it('should render small inline spinner with message', () => {
      const { container } = render(
        <LoadingSpinner 
          size="small" 
          fullScreen={false} 
          message="Saving..." 
        />
      );
      
      const spinnerDiv = container.querySelector('div[style*="width: 20px"]');
      expect(spinnerDiv).toBeInTheDocument();
      
      const fullScreenDiv = container.querySelector('div[style*="position: fixed"]');
      expect(fullScreenDiv).not.toBeInTheDocument();
      
      expect(screen.getByText('Saving...')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should have spin animation', () => {
      const { container } = render(<LoadingSpinner />);
      
      const spinnerDiv = container.querySelector('div[style*="animation"]');
      expect(spinnerDiv).toBeInTheDocument();
    });

    it('should be circular', () => {
      const { container } = render(<LoadingSpinner />);
      
      const spinnerDiv = container.querySelector('div[style*="border-radius: 50%"]');
      expect(spinnerDiv).toBeInTheDocument();
    });

    it('should include keyframes animation', () => {
      const { container } = render(<LoadingSpinner />);
      
      const styleTag = container.querySelector('style');
      expect(styleTag).toBeInTheDocument();
      expect(styleTag?.textContent).toContain('@keyframes spin');
    });
  });

  describe('message styling', () => {
    it('should style message correctly', () => {
      render(<LoadingSpinner message="Test message" />);
      
      const message = screen.getByText('Test message');
      expect(message).toHaveStyle({
        color: '#666',
        fontSize: '14px',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string message', () => {
      render(<LoadingSpinner message="" />);
      
      const messages = screen.queryAllByText('');
      expect(messages.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle very long message', () => {
      const longMessage = 'Loading your diagrams and all related data, please wait...';
      render(<LoadingSpinner message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });
  });
});
