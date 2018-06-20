var NewToken=artifacts.require("./NewToken.sol");

contract('NewToken',function(account){
	it("sets total supply on launch",function(){
		return NewToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,'set total supply to 1mill');
		});
	});
})