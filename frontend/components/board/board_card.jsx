import React from 'react';
import { Link, withRouter } from 'react-router';
import Modal from 'react-modal';

class BoardCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openEditBoardModal: false,
      title: "",
      description: "",
      user_id: this.props.currentUser
    };

    this.fetchBoard = this.props.fetchBoard.bind(this);
    this.fetchBoards = this.props.fetchBoards.bind(this);
    this.updateBoard = this.props.updateBoard.bind(this);
    this.deleteBoard = this.props.deleteBoard.bind(this);

    this.handleEditBoardSubmit = this.handleEditBoardSubmit.bind(this);
    this.handleDeleteBoardSubmit = this.handleDeleteBoardSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({title: nextProps.board.title });
    this.setState({description: nextProps.board.description });
  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true && JSON.stringify(obj) === JSON.stringify({});
  }

  openBoardModal() {
    this.setState({
      openEditBoardModal: true
    });
  }

  closeBoardModal() {
    this.setState({
      openEditBoardModal: false
    });
  }

  update(field){
		return e => { this.setState({[field]: e.currentTarget.value }); };
	}

  handleEditBoardSubmit(e){
    e.preventDefault();
    this.updateBoard({
      board: {
        id: this.props.board.id,
        title: this.state.title,
        description: this.state.description
      }
    });
    this.fetchBoards(this.props.user.id);
    this.closeBoardModal();
	}

  handleDeleteBoardSubmit(e){
    e.preventDefault();
    this.deleteBoard(this.props.board.id);
    this.fetchBoards(this.props.user.id);
    this.closeBoardModal();
  }

  render() {
    let newBoardStyle = {
      overlay : {
      position        : 'fixed',
      top             : 0,
      left            : 0,
      right           : 0,
      bottom          : 0,
      backgroundColor : 'rgba(117, 117, 117, 0.75)'
      },
      content : {
        borderRadius: '4px',
        bottom: 'auto',
        minHeight: '10rem',
        left: '50%',
        padding: '2rem',
        position: 'fixed',
        right: 'auto',
        top: '50%',
        transform: 'translate(-50%,-50%)',
        minWidth: '10rem',
        width: '400px',
        maxWidth: '60rem',
        backgroundColor : 'rgba(255, 255, 255, 1)',
        boxShadow : '3px 3px 10px black',
      }
    };

    // Need to grab three images if possible, cover and two thumbs
    let pinsImageUrl =[null, null, null];
    let pinCounts = 0;
    if (this.props.pins !== undefined) {
      let pinKeyArr = Object.keys(this.props.pins);
      pinCounts = pinKeyArr.length;

      for (var i = 0; i < 3; i++) {
        if (i < pinKeyArr.length) {
          pinsImageUrl[i] = this.props.pins[pinKeyArr[i]].image_url;
        }
      }
    }
    let pinImages = pinsImageUrl.map((url, idx) => {
      if (url === null) {
        return "";
      } else {
        return (
          <img src={url} />
        );
      }
    });

    let boardUrl = "/boards/"+this.props.board.id;

    let editButton = null;
    if (this.props.currentUser.id === this.props.user.id) {
      editButton = (
        <button className='edit-board-button' onClick={this.openBoardModal.bind(this)}>
          <em></em>
        </button>
      );
    }

    return (
      <section className="board-card-container" key={this.props.board.id+this.props.board.title}>
        <Link to={boardUrl}>
          <div className='pin-picture-section'>
              <div className='boardcover'>
                <div className='pin-picture-background pin-picture-cover'>
                  {pinImages[0]}
                </div>
              </div>
              <div className='boardthumbs'>
                <div className='pin-picture-background pin-picture-thumb'>
                  {pinImages[1]}
                </div>
                <div className='pin-picture-background pin-picture-thumb'>
                  {pinImages[2]}
                </div>
              </div>
          </div>
        </Link>
        <br/>
        <div className='detail-section'>
          <div className='board-title'>{this.props.board.title}</div>
          <div className='pin-count-section'>
            <div className='pin-count'>{pinCounts} Pins</div>
          </div>
          {editButton}
        </div>

        <Modal className='BoardModal'
          isOpen={this.state.openEditBoardModal}
          onRequestClose={this.closeBoardModal.bind(this)}
          style={newBoardStyle}>
          <section className="modal-form-container">
            <form	className="modal-form-box">

              <div className="modal-form">
                <label className='modal-label'>
                  <p className='modal-label-text'>Title</p>
                  <input
                    type="text"
                    onChange={this.update("title")}
                    value={this.state.title}
                    className="title-input modal-input" />
                </label>

                <label className='modal-label'><p className='modal-label-text'>Description</p>
                  <textarea name='description'
                    onChange={this.update("description")}
                    value={this.state.description}
                    className="description-input modal-input" ></textarea>
                </label>

                <div className="modal-save-button-box">
                  <input type="submit"
                    className="modal-save-button"
                    id="board-modal-delete-button"
                    value='Delete Board'
                    onClick={this.handleDeleteBoardSubmit}/>
                  <input type="submit"
                    className="modal-save-button"
                    id="board-modal-edit-button"
                    value='Update Board'
                    onClick={this.handleEditBoardSubmit}/>
                </div>
              </div>
            </form>
          </section>

        </Modal>

      </section>
    );
  }
}

export default withRouter(BoardCard);
