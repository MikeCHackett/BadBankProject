function Withdraw() {
  //const ctx = React.useContext(UserContext);

  function handle () {
      //ctx.users.push({name: data.name, withdraw: data.withdraw});
      return true;
  }

  return (
      <Card
        bgcolor="primary"
        header="Withdraw"
        withdraw={handle}
        submitButtonWithdraw="Withdrawl Successful"
      />
  )
}
