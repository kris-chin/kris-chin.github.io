/* -------------------------------------------------------------------------- */
/*                                  ProjectLinks.tsx                                 */
/* -------------------------------------------------------------------------- */
// Simple component that displays links

import React, { Component } from 'react'

interface LinksProps {
    github: string | undefined
}

export default class ProjectLinks extends Component {
  
  github(githubLink: string | undefined) {
    if (githubLink) return <a href={githubLink}>Github</a>
    else return <></>
  }

  render() {
    const props = this.props as LinksProps;

    return (
      <div className = "links_section">
          {this.github(props.github)}
      </div>
    )
  }
}
