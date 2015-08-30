var React = require('react');

var Header = React.createClass({
  render: function () {
    return (
      <header>
        <h1>Scores</h1>
        <h2>Suivez en direct l'évolution des participants</h2>
      </header>
    )
  }
});

module.exports = Header;