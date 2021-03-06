pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Routers/IUniswapV2Router02.sol";

contract AltStaking{

  address public stakingToken;
  address public rewardToken;

  uint public rewardTime = 600000;
  uint public freezeTime = 1200000;
  uint public rewardShare = 20;

  function setRewardTime(uint _rewardTime) external {
    rewardTime = _rewardTime;
  }

  function setFreezeTime(uint _freezeTime) external {
    freezeTime = _freezeTime;
  }

  function setRewardShare(uint _rewardShare) external {
    rewardShare = _rewardShare;
  }

  struct Stakeholder{
    uint256 stake;
    uint256 timestamp;
    uint256 reward;
    bool exist;
  }



  event Stake(address indexed stakeholder, uint amount, uint timestamp);
  event Unstake(address indexed stakeholder, uint amount, uint remain);
  event Claim(address indexed stakeholder, uint amount, uint remain);

  mapping (address=>Stakeholder) stakeholders;

  constructor(address _stakingToken, address _rewardToken) public {
    stakingToken = _stakingToken;
    rewardToken = _rewardToken;
  }

  function stake(uint _amount) external {
    require(IERC20(stakingToken).allowance(msg.sender, address(this)) >= _amount, "Error: Contract has no allowances to transfer this token amount from you!");
    IERC20(stakingToken).transferFrom(msg.sender, address(this), _amount);

    if(!stakeholders[msg.sender].exist){
      stakeholders[msg.sender].exist = true;
    }
    if(stakeholders[msg.sender].stake != 0){
      stakeholders[msg.sender].reward += (block.timestamp - stakeholders[msg.sender].timestamp)/5;
    }
    stakeholders[msg.sender].timestamp = block.timestamp;
    stakeholders[msg.sender].stake += _amount;
    emit Stake(msg.sender, _amount, block.timestamp);
  }

  function getStakeholder(address _stakeholder) view external returns(Stakeholder memory){
    Stakeholder memory stakeholder = stakeholders[_stakeholder];
    return stakeholder;
  }

  function _claim(Stakeholder storage _stakeholder, uint _amount) internal {

    IERC20(rewardToken).transfer(msg.sender, _amount);
    _stakeholder.reward -= _amount;
    _stakeholder.timestamp = block.timestamp;
    emit Claim(msg.sender, _amount, _stakeholder.reward);
  }

  function _getCurrentMaxReward(uint _currentTime, Stakeholder storage _stakeholder) internal view returns (uint) {
    uint percent = (_currentTime - _stakeholder.timestamp)*100/rewardTime;
    uint first = percent/100;
    uint second = (percent%100)/10;
    uint third = percent%10;
    uint finalPercent = rewardShare*first + rewardShare/second;
    uint finalReward = (_stakeholder.stake/100)*finalPercent + (_stakeholder.stake/1000)*third;
    return finalReward;
  }

  function claimAll() external {
    Stakeholder storage stakeholder = stakeholders[msg.sender];
    require((block.timestamp - stakeholder.timestamp >= rewardTime && stakeholder.exist) || stakeholder.reward != 0, "U have no reward tokens yet!");

    if(block.timestamp - stakeholder.timestamp >= rewardTime){
      stakeholder.reward += _getCurrentMaxReward(block.timestamp, stakeholder);
    }
      uint _amount = stakeholder.reward;
      _claim(stakeholder, _amount);
  }

  function claim(uint _amount) external {
    Stakeholder storage stakeholder = stakeholders[msg.sender];
    require((block.timestamp - stakeholder.timestamp >= rewardTime && stakeholder.exist) || stakeholder.reward != 0, "U have no reward tokens yet!");

    if(block.timestamp - stakeholder.timestamp >= rewardTime){
      stakeholder.reward += _getCurrentMaxReward(block.timestamp, stakeholder);
    }
    require(stakeholder.reward >= _amount, "You haven't such a big value of reward tokens");
    _claim(stakeholder, _amount);
  }

  function unstake(uint _amount) external {
    Stakeholder storage stakeholder = stakeholders[msg.sender];
    require(stakeholder.exist, "You have no stake tokens.");
    _unstake(stakeholder, _amount);
  }

  function unstakeAll() external {
    Stakeholder storage stakeholder = stakeholders[msg.sender];
    require(stakeholder.exist, "You have no stake tokens.");
    _unstake(stakeholder, stakeholder.stake);
  }

  function _unstake(Stakeholder storage _stakeholder, uint _amount) internal {
    require(_stakeholder.stake >= _amount, "You have no such a big amount of stake tokens.");
    require(block.timestamp - _stakeholder.timestamp >= freezeTime, "U cant get back your reward tokens yet!");
    IERC20(stakingToken).transfer(msg.sender, _amount);
    _stakeholder.stake -= _amount;
    emit Unstake(msg.sender, _amount, _stakeholder.stake);
  }

}
