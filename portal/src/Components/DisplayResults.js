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
        sources: this.props.sources,
        surfaceweb_sources: this.props.surfaceweb_sources,
        medianscore: this.props.medianscore,
        attribute_values: {  
            phonenumber: 1.434,
            email: .438,
            address: 2.032,
            birthday: .279,
            hometown: .359,
            currenttown: .279,
            jobdetails: .478,
            relationshipstatus: .996,
            interests: .717,
            political: 1.355,
            religious: 1.633
        }
      };
      const initialState = this.state;
    }

    render() {
        return (
            <div>
                {this.state.score > 0 ? 
                    <div className="text-center">
                        <h6>The following table displays the attributes we are able to discover about you through data breaches and surface web searches.</h6>
                        <h6>The scores represent how potentially damaging each piece of information can be if it gets in the wrong hands.</h6>
                        <Table striped bordered hover>
                        <thead>
                            <tr>
                            <th>Leaked Personal Attribute</th>
                            <th>Associated Score</th>
                            </tr>
                        </thead>
                        <tbody>
                        {this.state.phoneNumber ? <tr><td>contact number</td><td>{this.state.attribute_values.phonenumber}</td></tr> : null}
                        {this.state.email ? <tr><td>email</td><td>{this.state.attribute_values.email}</td></tr> : null}
                        {this.state.password ? <tr><td>password</td><td>{this.state.attribute_values.password}</td></tr> : null}
                        {this.state.address ? <tr><td>address</td><td>{this.state.attribute_values.address}</td></tr> : null}
                        {this.state.birthday ? <tr><td>birthday</td><td>{this.state.attribute_values.birthday}</td></tr> : null}
                        {this.state.hometown ? <tr><td>hometown</td><td>{this.state.attribute_values.hometown}</td></tr> : null}
                        {this.state.currenttown ? <tr><td>current town</td><td>{this.state.attribute_values.currenttown}</td></tr> : null}
                        {this.state.jobdetails ? <tr><td>job details</td><td>{this.state.attribute_values.jobdetails}</td></tr> : null}
                        {this.state.relationshipstatus ? <tr><td>relationship status</td><td>{this.state.attribute_values.relationshipstatus}</td></tr> : null}
                        {this.state.interests ? <tr><td>interests</td><td>{this.state.attribute_values.interests}</td></tr> : null}
                        {this.state.political ? <tr><td>political views</td><td>{this.state.attribute_values.political}</td></tr> : null}
                        {this.state.religious ? <tr><td>religious views</td><td>{this.state.attribute_values.religious}</td></tr> : null}
                        </tbody>
                        </Table>
                        <h3>Your privacy exposure rating is: {this.state.score}/10.0</h3>
                        {this.state.medianscore=="tot" ? <h3>The median score is 3.6 </h3> : <h3>The median score for your generation is {this.state.medianscore}</h3> }
                        
                        <h5>Data was leaked from the following sources:</h5>
                        <p>{this.state.sources}</p>
                    </div> 
                    : 
                    // this.state.show ? <h1>Your data is safe!</h1> :  null
                    null
                }
            </div>
        )
      }
    
}

export default DisplayResults;