/* eslint-disable max-lines-per-function */
import { element } from 'tsx-vanilla';
import { PageTitle } from '@pages/page-title.decorator';
import { Component } from '@shared/lib';
import RSSchoolImg from '@assets/img/rs_school.element.svg';
import GitIcon from '@assets/icons/github.element.svg';
import * as s from './about-us.module.scss';
import { AboutUsPageLink, AboutUsPageText } from './config';

@PageTitle('About Us')
class AboutUs extends Component {
  render(): JSX.Element {
    return (
      <div className={s.aboutUs}>
        <h3>{AboutUsPageText.Title}</h3>
        <h5>{AboutUsPageText.SubtitleDescription}</h5>
        <p>{AboutUsPageText.Description}</p>
        <a href={AboutUsPageLink.Rsschool}>{RSSchoolImg}</a>
        <h6>{AboutUsPageText.BuiltWith}</h6>
        <ul>
          <li>
            <p>{AboutUsPageText.BuiltWithTextLine1}</p>
          </li>
          <li>
            <p>{AboutUsPageText.BuiltWithTextLine2}</p>
          </li>
          <li>
            <p>{AboutUsPageText.BuiltWithTextLine3}</p>
          </li>
        </ul>
        <h6>{AboutUsPageText.UsedTools}</h6>
        <ul>
          <li>
            <p>{AboutUsPageText.UsedToolsLine1}</p>
          </li>
        </ul>
        <h5>{AboutUsPageText.SubtitleTeam}</h5>
        <ul>
          <li>
            <h6>{AboutUsPageText.OurTeamLider}</h6>
            <p>{AboutUsPageText.Marat}</p>
            <a href={AboutUsPageLink.GithubMarat}>
              {GitIcon.cloneNode(true)}
              {AboutUsPageText.GithubMarat}
            </a>
          </li>
          <li>
            <h6>{AboutUsPageText.ExTeamLider}</h6>
            <p>{AboutUsPageText.Alex}</p>
            <p>{AboutUsPageText.AlexBio}</p>
            <a href={AboutUsPageLink.GithubAliaksandr}>
              {GitIcon.cloneNode(true)}
              {AboutUsPageText.GithubAliaksandr}
            </a>
          </li>
          <li>
            <h6>{AboutUsPageText.OurTeamMember}</h6>
            <div className={s.teamMemberImg}>
              <img
                height="200"
                width="200"
                src="https://avatars.githubusercontent.com/u/5229594?v=4"
                alt="Mikalai photo"
              />
            </div>
            <p>{AboutUsPageText.Mikalai}</p>
            <p>{AboutUsPageText.MikalaiBio}</p>
            <a href={AboutUsPageLink.GithubMikalai}>
              {GitIcon.cloneNode(true)}
              {AboutUsPageText.GithubMikalai}
            </a>
          </li>
        </ul>
      </div>
    );
  }
}

export default AboutUs;
