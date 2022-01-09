function Home(){
  return (
    <Card
      bgcolor="secondary"
      txtcolor="black"
      header="BadBank Landing Module"
      title="Welcome to Bad Bank"
      text="Interact with the menu to begin!"
      body={(<img src="bank.png" className="img-fluid" alt="Responsive image"/>)}
    />    
  );  
}
