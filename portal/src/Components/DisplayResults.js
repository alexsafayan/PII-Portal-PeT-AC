import React from 'react';
import Table from 'react-bootstrap/Table'




class DisplayResults extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        show: this.props.show,
        score: this.props.score,
        email: this.props.email,
        address: this.props.address,
        password: this.props.password,
        phoneNumber: this.props.phoneNumber,
        zip: this.props.zip,
        ssn: this.props.ssn,
        birthyday: this.props.birthyday,
        hometown: this.props.hometown,
        currenttown: this.props.currenttown,
        jobdetails: this.props.jobdetails,
        relationshipstatus: this.props.relationshipstatus,
        interests: this.props.interests,
        political: this.props.political,
        religious: this.props.religious,
        databreach_sources: this.props.databreach_sources,
        surfaceweb_sources: this.props.surfaceweb_sources
      };
      const initialState = this.state
        const attribute_values = {  phonenumber: .6,
                                    email: .1833,
                                    address: .85,
                                    birthday: .1166,
                                    hometown: .15,
                                    currenttown: .1166,
                                    jobdetails: .2,
                                    relationshipstatus: .4166,
                                    interests: .3,
                                    political: .6833,
                                    religious: .5666
                                }
    }

    render() {
        return (
            <div>
                {this.state.score > 0 ? 
                    <p>
                        <h1>Your data is compromised!</h1> 
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Leaked Personal Attribute</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.phonenumber ? <tr> <td>contact number</td> </tr>  : null}
                        {this.state.email ? <tr> <td>email</td> </tr>  : null}
                        {this.state.password ? <tr> <td>password</td> </tr>  : null}
                        {this.state.address ? <tr> <td>address</td> </tr>  : null}
                        {this.state.birthday ? <tr> <td>birthday</td> </tr>  : null}
                        {this.state.hometown ? <tr> <td>hometown</td> </tr>  : null}
                        {this.state.currenttown ? <tr> <td>current town</td> </tr>  : null}
                        {this.state.hometown ? <tr> <td>home town</td> </tr>  : null}
                        {this.state.jobdetails ? <tr> <td>job details</td> </tr>  : null}

                        {this.state.relationshipstatus ? <tr>relationship status<td></td> </tr>  : null}
                        {this.state.interests ? <tr> <td>interests</td> </tr>  : null}
                        {this.state.political ? <tr> <td>political views</td> </tr>  : null}
                        {this.state.religious ? <tr> <td>religious views</td> </tr>  : null}
                        </tbody>
                        </Table>
                    </p> 
                    : 
                    this.state.show ? <h1>Your data is safe!</h1> :  null
                }
            </div>
        )
      }
    
}

export default DisplayResults;