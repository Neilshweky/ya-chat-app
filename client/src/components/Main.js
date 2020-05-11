/**
 * Template from https://reactjsexample.com/react-messenger/
 */
import React from 'react';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import '../style/Messenger.css';


export default class Main extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component.
    this.state = {
    }

    // this.showMovies = this.showMovies.bind(this);
  }

  checkError(res) {
    console.log(res.status)
    if(!res.ok) {
      let error = new Error("there was an error")
      error.status = res.status
      throw error;
    }
    return res.json()
  }
  // React function that is called when the page load.
  componentDidMount() {
    const { history } = this.props;

    if (!window.localStorage.getItem('_id')) {
      history.push('/login')
      console.log("NEEDS AUTH")
      return
    }
    fetch('http://localhost:8080/getchats')
      .then(this.checkError)
      .then(res => console.log('HERE', res))
      .catch(err => {
        if (err.status === 401) {
          history.push('/login')
        } else console.log("ERR", err)
      })
  }

  render() { 
    return (
      <div className="messenger">
        {/* <Toolbar
          title="Messenger"
          leftItems={[
            <ToolbarButton key="cog" icon="ion-ios-cog" />
          ]}
          rightItems={[
            <ToolbarButton key="add" icon="ion-ios-add-circle-outline" />
          ]}
        /> */}

        {/* <Toolbar
          title="Conversation Title"
          rightItems={[
            <ToolbarButton key="info" icon="ion-ios-information-circle-outline" />,
            <ToolbarButton key="video" icon="ion-ios-videocam" />,
            <ToolbarButton key="phone" icon="ion-ios-call" />
          ]}
        /> */}

        <div className="scrollable sidebar">
          <ConversationList />
        </div>

        <div className="scrollable content">
          <MessageList />
        </div>
      </div>
    );
  }
}