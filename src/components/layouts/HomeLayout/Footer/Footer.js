import React, { memo } from 'react';
import P12 from '@components/_shared/text/P12';
import { Col, Row } from 'react-bootstrap';
import { constantsLinks, constantsSocial } from './constants';

import './Footer.scss';

const Footer = () => (
	<footer className='footer-wrapper'>
		<div className='footer-container'>
			<Row>
				<Col
					xs={6}
					sm={4}
					lg={{ span: 4, offset: 1 }}
					xl={{ span: 2, offset: 3 }}
				>
					<ul>
						{constantsLinks[0].map((link, index) => (
							<li key={link.name + index}>
								<a
									href={link.path}
									className='link'
									target='_blank'
									rel='noreferrer'
								>
									<P12 className='footer-container__white-text'>
										{link.name}
									</P12>
								</a>
							</li>
						))}
					</ul>
				</Col>
				<Col
					xs={6}
					sm={4}
					lg={4}
					xl={2}
				>
					<ul>
						{constantsLinks[1].map((link, index) => (
							<li key={link.name + index}>
								<a
									href={link.path}
									className='link'
									target='_blank'
									rel='noreferrer'
								>
									<P12 className='footer-container__white-text'>
										{link.name}
									</P12>
								</a>
							</li>
						))}
					</ul>
				</Col>
				<Col
					xs={12}
					sm={4}
					lg={3}
					xl={2}
				>
					<div className='social-container'>
						<div className='social-links'>
							{constantsSocial.map((social, index) => (
								<a
									href={social.href}
									key={index}
									target='_blank'
									rel='noreferrer'
								>
									{social.icon}
								</a>
							))}
						</div>
						<P12 className='footer-container__white-text copyright'>
							© {new Date().getFullYear()}, RetailHub Innovation Explorer
						</P12>
					</div>
				</Col>
			</Row>
		</div>
	</footer>
);

export default memo(Footer);
