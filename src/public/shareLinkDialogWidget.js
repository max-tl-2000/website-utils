/*
 * Copyright (c) 2022 Reva Technology Inc., all rights reserved.
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Licensed under the Elastic License 2.0; you may not use this file except
 * in compliance with the Elastic License 2.0.
 */

import { renderComponent } from '../common/render-helper';
import ShareLinkDialogContainer from '../Website/Containers/ShareLinkDialogContainer/ShareLinkDialogContainer';

export const createShareLinkDialogWidget = selector => renderComponent(ShareLinkDialogContainer, { selector });
