import React from 'react';




class DisplayResults extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        email: this.props.email,
        password: this.props.password,
        zip: this.props.zip,
        phoneNumber: this.props.phoneNumber,
        ssn: this.props.ssn,
        address: this.props.address,
        relatives: this.props.relatives,
        databreach_sources: this.props.databreach_sources,
        surfaceweb_sources: this.props.surfaceweb_sources
      };
      const initialState = this.state
    }

    render() {
        return (
            <div>
                {this.state.email ? 
                    <p>
                        <h1>Your data is compromised!</h1> 
                        <p>Data Breaches involved:
                        {this.state.databreach_sources.map(databreach_source => (
                            <li>
                                {databreach_source}
                            </li>
                        ))}
                        </p>
                        <p>Leaked Data:
                        {this.state.password ? <b> password, </b>  : null}
                        {this.state.ssn ? <b> ssn</b> : null}

                        
                        </p>
                        <p>You are also leaking personal information on the surface web from the following sources.
                        {this.state.surfaceweb_sources.map(surfaceweb_source => (
                            <li>
                                {surfaceweb_source}
                            </li>
                        ))}
                        </p>
                        <p>This leakage includes:
                        {this.state.zip ? <b> zip code, </b> : null}
                        {this.state.address ? <b> address, </b> : null}
                        {this.state.phoneNumber ? <b> phone number</b> : null}
                        {this.state.relatives ? <li>relatives</li> : null}
                        </p>
                    </p> 
                    : 
                    null
                }
            </div>
        )
      }
    
}

export default DisplayResults;