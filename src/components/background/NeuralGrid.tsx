/**
 * NeuralGrid — An enhanced technical grid background with very subtle
 * circuit-like patterns. All done with CSS background-image for zero DOM cost.
 */
export default function NeuralGrid() {
  return (
    <div className="ag-neural-grid" aria-hidden="true">
      {/* The main grid is handled by CSS. These divs add circuit accents */}
      <div className="ag-circuit ag-circuit--tl" />
      <div className="ag-circuit ag-circuit--br" />
    </div>
  );
}
