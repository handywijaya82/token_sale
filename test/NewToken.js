var NewToken=artifacts.require("./NewToken.sol");

contract('NewToken',function(accounts){
	var tokenInstance;

	it("Initializing variables",function(){
		return NewToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.name();
		}).then(function(name){
			assert.equal(name,'NewToken','Correct Name');
			return tokenInstance.symbol();
		}).then(function(symbol){
			assert.equal(symbol,'NTN','Correct Symbol');
			return tokenInstance.standard();
		}).then(function(standard){
			assert.equal(standard,'NewToken v1.0','Correct standard');
		});
	});

	it("sets initial supply on launch",function(){
		return NewToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.totalSupply();
		}).then(function(totalSupply){
			assert.equal(totalSupply.toNumber(),1000000,'set total supply to 1mill');
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(adminBalance){
			assert.equal(adminBalance.toNumber(),1000000,'admin balance');
		});
	});

	it('transferring tokens',function(){
		return NewToken.deployed().then(function(instance){
			tokenInstance=instance;
			return tokenInstance.transfer.call(accounts[1],99999999999999)
		}).then(assert.fail).catch(function(error){
			assert(error.message.indexOf('revert')>=0,'error msg not contain revert');	
			return tokenInstance.transfer.call(accounts[1],250000,{from:accounts[0]});
		}).then(function(success){
			assert.equal(success,true,"returning true");
			return tokenInstance.transfer(accounts[1],250000,{from:accounts[0]});
		}).then(function(receipt){
			assert.equal(receipt.logs.length,1,'trigger 1 event');
			assert.equal(receipt.logs[0].event,'Transfer','Its a transfer event');
			assert.equal(receipt.logs[0].args._from,accounts[0],'transferred from');
			assert.equal(receipt.logs[0].args._to,accounts[1],'transferred to');
			assert.equal(receipt.logs[0].args._value,250000,'transferred amount');
			return tokenInstance.balanceOf(accounts[1]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),250000, "add amount to receiver");
			return tokenInstance.balanceOf(accounts[0]);
		}).then(function(balance){
			assert.equal(balance.toNumber(),750000,'min amount from sender');
		});
	});
});