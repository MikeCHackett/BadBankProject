const Route         = ReactRouterDOM.Route;
const Link          = ReactRouterDOM.Link;
const HashRouter    = ReactRouterDOM.HashRouter;
const UserContext   = React.createContext(null);

// Global variable to manage the current User identifier
// makes use of the login for-loop and provides a user Index to use across all pages
let currentUserIndex = 0;
function assignUserID(userID) {
    currentUserIndex = userID-1;
    return currentUserIndex;
};

function Card(props) {
    const [show, setShow]          = React.useState(true);
    const [status, setStatus]      = React.useState('');
    const [name, setName]          = React.useState('');
    const [email, setEmail]        = React.useState('');
    const [password, setPassword]  = React.useState('');
    const [deposit, setDeposit]    = React.useState('');
    const [withdraw, setWithdraw]  = React.useState('');
    const ctx = React.useContext(UserContext);
    let users = [...ctx.users];
    
    // balance uses global userID to retrieve balance
    let balance = users[currentUserIndex].balance;
    let userName = users[currentUserIndex].name;
    // debugging only
    console.log(`Balance of ${userName} is ${balance}`);
  
  // validation function used in handleCreate
  function validate(field, label) {
    if (!field) {
        setStatus('Error: ' + label);
        setTimeout(() => setStatus(''), 3000);
        alert(`Enter field: ${label}`);
        return false;
    }
    if (field === deposit) {
        if (deposit <= 0) {
            alert("Enter a positive number value to deposit");
            return false;
        }
    }
    if (field === withdraw) {
        if (withdraw <= 0) {
            alert("Enter a positive number value to withdraw");
            return false;
        }
    }
    // email validation in progress
    if (field === email) {
      // check that email string contains the @ symbol
      if (email.includes('@') === true) return true;
      else {
        alert("Enter Valid Email");
        return false;
      }
    }
    return true;
  }

    function validateForm() {
        return password.length > 8 && name.length > 0 && email.length > 0;
    }

    function validateLogin() {
        return password.length > 8 && name.length > 0;
    }
    
    function handleCreate() {
        console.log(name, email, password);
        if (!validate(name,     'name'))     return;
        if (!validate(email,    'email'))    return;
        if (!validate(password, 'password')) return;
        ctx.users.push({id: users.length+1, name, email, password, balance: 100});
        setShow(false);
    }
    
    function clearForm() {
        setName('');
        setEmail('');
        setPassword('');
        setDeposit('');
        setWithdraw('');
        setShow(true);
    }

    function handleDeposit() {
        console.log(name, `Deposit amount: ${deposit}`);
        if (!validate(name,       'name'))       return;
        if (!validate(deposit,    'deposit'))    return;
        if (name === users[currentUserIndex].name) {
          //ctx.users.push({deposit});
          users[currentUserIndex].balance += Number(deposit);
          setShow(false);
          return;
        } else {
            alert(`Incorrect User input.`);
            clearForm();
            setShow(true);
        }
    }

    function handleWithdraw() {
        if (!validate(name,       'name'))       return;
        if (!validate(withdraw,    'withdrawl'))    return;
        if (name === users[currentUserIndex].name){
            if ((Number(withdraw)) <= balance) {
                console.log(name, `Withdrawl amount: ${withdraw}`);
                //ctx.users.push({withdraw});
                users[currentUserIndex].balance -= Number(withdraw);
                setShow(false);
            } else {
                alert("Insufficient Funds");
                return;
            }
        } else {
            alert(`Incorrect User input.`);
            clearForm();
        }
        
    }

    function handleLogin() {
        if (!validate(name,     'name'))     return;
        if (!validate(password, 'password')) return;
        // loop over users array and check for the same name as entered
        for (let i = 0; i <= users.length - 1; i++){
            // check if counter gets to end of users list and finds nothing
            if (i === (users.length -1) && users[i].name !== name) {
                alert("Not a Current User: Please Create Account or try other credentials");
                setShow(true);
                clearForm();
                return;
            }
            // name is not the name at the position in the list
            if (name !== users[i].name){
                continue;
            }
            // name is the name in the list but password incorrect
            if (name === users[i].name && password !== users[i].password) {
                alert("Incorrect Password, try again...");
                setShow(true);
                setPassword('');
                return;
            }
            // name is the name in the list and password is correct
            if (name === users[i].name && password === users[i].password){
                let userID = users[i].id;
                alert(`Current User is ${users[i].name} with id: ${userID}`);
                setShow(false);
                console.log(name, password, userID);
                assignUserID(userID);
                return;
            }
        }
    }

    function classes() {
        const bg = props.bgcolor ? ' bg-' + props.bgcolor : ' ';
        const txt = props.txtcolor ? ' text-' + props.txtcolor: ' text-white';
        return 'card mb-3' + bg + txt;
    }

    return (
        <div className={classes()} style={{maxWidth: "18rem"}}>
            <div className="card-header">{props.header}</div>
            <div className="card-body">
                {props.title && (<h5 className="card-title">{props.title}</h5>)}
                {props.text && (<p className="card-text">{props.text}</p>)}
                {props.body}
                {/* Create Account Card */}
                {props.handle && show ? (
                   <>
                   Name<br/>
                   <input type="input" className="form-control" id="name" placeholder="Enter Name" value={name} onChange={e => setName(e.currentTarget.value)} /><br/>
                   Email address<br/>
                   <input type="input" className="form-control" id="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.currentTarget.value)} /><br/>
                   Password<br/>
                   <input type="password" className="form-control" id="password" placeholder="Enter Password (8+ characters)" value={password} onChange={e => setPassword(e.currentTarget.value)} /><br/>
                   <button type="submit" disabled={!validateForm()} className="btn btn-light" onClick={handleCreate} >Create Account</button>
                   </>
                ) : (
                props.submitButton && (
                   <>
                    <div className="card text-white text-center bg-success mb-3">
                       <h5>Success</h5>
                    </div>
                    <button type="submit" className="btn btn-secondary" onClick={clearForm} >{props.submitButton}</button>
                   </>
                )
                )}
                {props.status && (<div id="'createStatus">{props.status}</div>)}
                {/* Deposit Card */}
                {props.deposit && show ? (
                  <>
                  Balance for {userName}'s Account           {balance} <br/><br/>
                  Account Name<br/>
                  <input type="input" className="form-control" id="name" placeholder="Enter Name" value={name} onChange={e => setName(e.currentTarget.value)} /><br/>
    
                  Deposit Amount<br/>
                  <input type="number" className="form-control" id="withdraw" placeholder="Enter Deposit Amount" value={deposit} onChange={e => setDeposit(e.currentTarget.value)} /><br/>
    
                  <button type="submit" className="btn btn-light" onClick={handleDeposit} >Deposit</button>
                  </>
                ) : (props.submitButtonDeposit && (
                    <>
                    <div className="card text-white text-center bg-success mb-3">
                      <h5>Successful Deposit</h5>
                    </div>
                    <button type="submit" className="btn btn-secondary" onClick={clearForm} >Make another Transaction</button>
                    </>
                  )
                )}
                {/* Withdraw Card */}
                {props.withdraw && show ? (
                  <>
                  Balance for {userName}'s Account           {balance} <br/><br/>
                  Account Name<br/>
                  <input type="input" className="form-control" id="name" placeholder="Enter Name" value={name} onChange={e => setName(e.currentTarget.value)} /><br/>
                  
                  Withdrawl Amount<br/>
                  <input type="number" className="form-control" id="withdraw" placeholder="Enter Withdrawl Amount" value={withdraw} onChange={e => setWithdraw(e.currentTarget.value)} /><br/>
      
                  <button type="submit" className="btn btn-light" onClick={handleWithdraw} >Withdrawl</button>
                  </>
                ) : (props.submitButtonWithdraw && (
                    <>
                    <div className="card text-white text-center bg-success mb-3">
                      <h5>Successful Withdrawl</h5>
                    </div>
                    <button type="submit" className="btn btn-secondary" onClick={clearForm} >Make another Transaction</button>
                    </>
                    )
                )}
                {/* Login Card */}
                {props.login && show ? (
                  <>
                  Enter Account Name<br/>
                  <input type="input" className="form-control" id="name" placeholder="Enter Name" value={name} onChange={e => setName(e.currentTarget.value)}/><br/> 
                  Enter Password<br/>
                  <input type="password" className="form-control" id="password" placeholder="Enter Password" value={password} onChange={e => setPassword(e.currentTarget.value)}/><br/>
                  <button type="submit" disabled={!validateLogin()} className="btn btn-light" onClick={handleLogin} >Submit for verification</button>
                  </>
                ) : (props.submitButtonLogin && (
                  <>
                  <div className="card text-white text-center bg-success mb-3">
                    <h5>Success</h5>
                  </div>
                  <button type="submit" className="btn btn-secondary" onClick={clearForm} >Continue to Account</button>
                  </>
                  )
                )}
                {/* All Data card */}
                {props.allData && (
                <>
                  Name: {props.allData[0]}<br/>
                  Email: {props.allData[1]}<br/>
                  Password: {props.allData[2]}<br/>
                  Balance: {props.allData[3]}<br/>
                </>)}
            </div>
        </div>
    )
}